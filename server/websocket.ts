import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import { db } from './db';

interface ClientMeta {
  role: 'admin' | 'station' | 'guest';
  stationId?: string;
  isAlive: boolean;
}

export class WebSocketHub {
  private wss: WebSocketServer;
  private clientMetas = new Map<WebSocket, ClientMeta>();
  private tickerInterval: NodeJS.Timeout | null = null;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });

    this.wss.on('connection', (ws: WebSocket) => {
      this.clientMetas.set(ws, { role: 'guest', isAlive: true });

      // Send initial welcome & system time
      ws.send(JSON.stringify({
        type: 'SERVER_CONNECTED',
        serverTime: new Date().toISOString(),
        message: 'Connected to QHAR Gaming Cafe Master LAN Hub'
      }));

      ws.on('pong', () => {
        const meta = this.clientMetas.get(ws);
        if (meta) meta.isAlive = true;
      });

      ws.on('message', (raw: string) => {
        try {
          const msg = JSON.parse(raw.toString());
          this.handleClientMessage(ws, msg);
        } catch (err) {
          console.error('WebSocket parse error:', err);
        }
      });

      ws.on('close', () => {
        const meta = this.clientMetas.get(ws);
        if (meta && meta.role === 'station' && meta.stationId) {
          console.log(`Station ${meta.stationId} disconnected from LAN.`);
          this.broadcastToAdmins({
            type: 'STATION_CONNECTION_CHANGE',
            stationId: meta.stationId,
            online: false
          });
        }
        this.clientMetas.delete(ws);
      });
    });

    // Start 3-second session watchdog ticker
    this.startWatchdogTicker();

    // Heartbeat ping interval
    setInterval(() => {
      for (const [ws, meta] of this.clientMetas.entries()) {
        if (!meta.isAlive) {
          ws.terminate();
          this.clientMetas.delete(ws);
          continue;
        }
        meta.isAlive = false;
        ws.ping();
      }
    }, 15000);
  }

  private handleClientMessage(ws: WebSocket, msg: any) {
    const meta = this.clientMetas.get(ws)!;

    switch (msg.type) {
      case 'REGISTER': {
        meta.role = msg.role || 'guest';
        if (msg.role === 'station') {
          meta.stationId = msg.stationId;
          console.log(`Battle Station ${msg.stationId} registered online.`);
          this.broadcastToAdmins({
            type: 'STATION_CONNECTION_CHANGE',
            stationId: msg.stationId,
            online: true
          });
          // Send current station state to this station
          const station = db.getStation(msg.stationId);
          const activeSession = db.getSessions().find(s => s.stationId === msg.stationId && s.status === 'Active');
          ws.send(JSON.stringify({
            type: 'STATION_SYNC',
            station,
            activeSession
          }));
        }
        break;
      }

      // Customer requesting +30m / +1h extension from Client Kiosk
      case 'CLIENT_REQUEST_EXTEND': {
        const { stationId, minutes, customerName } = msg;
        console.log(`Extension requested by ${stationId} for +${minutes} mins`);
        
        // Find active session
        const session = db.getSessions().find(s => s.stationId === stationId && s.status === 'Active');
        if (session) {
          const updated = db.extendSession(session.id, minutes);
          // Send success to the station
          this.sendToStation(stationId, {
            type: 'SESSION_EXTENDED',
            stationId,
            minutes,
            scheduledEndTime: updated.scheduledEndTime,
            newEstimatedCharge: updated.estimatedCharge
          });
          // Broadcast update to all admins
          this.broadcastToAdmins({
            type: 'STATIONS_UPDATED',
            stations: db.getStations(),
            eventNote: `${customerName || stationId} extended session by +${minutes} minutes.`
          });
        }
        break;
      }

      // Customer pressing "Call Attendant" on Kiosk
      case 'CLIENT_CALL_ATTENDANT': {
        const { stationId, stationName, reason } = msg;
        console.log(`Attendant called at ${stationId}: ${reason}`);
        this.broadcastToAdmins({
          type: 'ATTENDANT_CALL_ALERT',
          stationId,
          stationName: stationName || stationId,
          reason: reason || 'Assistance requested at desk',
          timestamp: new Date().toISOString()
        });
        break;
      }

      // Admin manual unlock station
      case 'ADMIN_UNLOCK_STATION': {
        try {
          const session = db.startSession({
            stationId: msg.stationId,
            customerName: msg.customerName || 'Walk-in Gamer',
            customerPhone: msg.customerPhone,
            durationHours: msg.durationHours || 1,
            hourlyRate: msg.hourlyRate,
            paymentMethod: msg.paymentMethod || 'UPI'
          });

          // Send unlock to the physical station
          this.sendToStation(msg.stationId, {
            type: 'UNLOCK_STATION',
            stationId: msg.stationId,
            session
          });

          // Sync all admins
          this.broadcastToAdmins({
            type: 'STATIONS_UPDATED',
            stations: db.getStations(),
            eventNote: `Unlocked ${msg.stationId} for ${msg.customerName || 'Gamer'}`
          });
        } catch (err: any) {
          ws.send(JSON.stringify({ type: 'ERROR', message: err.message }));
        }
        break;
      }

      // Admin manual lock station
      case 'ADMIN_LOCK_STATION': {
        try {
          const session = db.getSessions().find(s => s.stationId === msg.stationId && s.status === 'Active');
          if (session) {
            db.endSession(session.id, msg.paymentMethod || 'Cash');
          } else {
            db.updateStation(msg.stationId, { status: 'Available', currentSessionId: undefined });
          }

          // Lock the physical station
          this.sendToStation(msg.stationId, {
            type: 'LOCK_STATION',
            stationId: msg.stationId,
            reason: msg.reason || 'Session ended by admin'
          });

          this.broadcastToAdmins({
            type: 'STATIONS_UPDATED',
            stations: db.getStations(),
            eventNote: `Locked station ${msg.stationId}`
          });
        } catch (err: any) {
          ws.send(JSON.stringify({ type: 'ERROR', message: err.message }));
        }
        break;
      }

      // Admin broadcast counter PA voice to all 20 stations
      case 'ADMIN_BROADCAST_PA': {
        const { message } = msg;
        this.broadcastAll({
          type: 'CAFE_PA_BROADCAST',
          message: message || 'Attention gamers, cafe announcement.',
          timestamp: new Date().toISOString()
        });
        break;
      }

      // Admin broadcast 5-min warning
      case 'ADMIN_BROADCAST_5MIN_WARNING': {
        this.broadcastToStations({
          type: 'WARNING_5MIN',
          stationId: 'ALL',
          minutesLeft: 5
        });
        break;
      }

      default:
        break;
    }
  }

  // Watchdog ticker checks active sessions every 3 seconds
  private startWatchdogTicker() {
    this.tickerInterval = setInterval(() => {
      const now = Date.now();
      const sessions = db.getSessions();
      let hasUpdates = false;

      for (const session of sessions) {
        if (session.status !== 'Active') continue;

        const endTime = new Date(session.scheduledEndTime).getTime();
        const diffMs = endTime - now;
        const remainingMinutes = diffMs / (60 * 1000);

        // 1. 5-Minute Warning Trigger
        if (remainingMinutes <= 5 && remainingMinutes > 0 && !(session as any).warned5Min) {
          (session as any).warned5Min = true;
          const minsLeft = Math.max(1, Math.ceil(remainingMinutes));

          console.log(`[WATCHDOG] 5-Minute Warning triggered for ${session.stationId} (${minsLeft} mins left)`);

          // Send to that specific physical station
          this.sendToStation(session.stationId, {
            type: 'WARNING_5MIN',
            stationId: session.stationId,
            minutesLeft: minsLeft,
            sessionId: session.id,
            customerName: session.customerName
          });

          // Alert admin dashboard
          this.broadcastToAdmins({
            type: 'STATION_5MIN_ALERT',
            stationId: session.stationId,
            stationName: session.stationName,
            customerName: session.customerName,
            minutesLeft: minsLeft
          });

          hasUpdates = true;
        }

        // 2. Time-Over Auto-Lockout Trigger
        if (remainingMinutes <= 0) {
          console.log(`[WATCHDOG] Session Expired for ${session.stationId}. Auto-locking!`);

          // Lock physical station
          this.sendToStation(session.stationId, {
            type: 'LOCK_STATION',
            stationId: session.stationId,
            reason: 'TIME_EXPIRED',
            customerName: session.customerName
          });

          // End session in DB and generate invoice
          db.endSession(session.id, 'Cash/Pending');

          hasUpdates = true;
        }
      }

      if (hasUpdates) {
        this.broadcastToAdmins({
          type: 'STATIONS_UPDATED',
          stations: db.getStations()
        });
      }
    }, 3000);
  }

  public sendToStation(stationId: string, payload: any) {
    const raw = JSON.stringify(payload);
    for (const [ws, meta] of this.clientMetas.entries()) {
      if (meta.role === 'station' && meta.stationId === stationId && ws.readyState === WebSocket.OPEN) {
        ws.send(raw);
      }
    }
  }

  public broadcastToStations(payload: any) {
    const raw = JSON.stringify(payload);
    for (const [ws, meta] of this.clientMetas.entries()) {
      if (meta.role === 'station' && ws.readyState === WebSocket.OPEN) {
        ws.send(raw);
      }
    }
  }

  public broadcastToAdmins(payload: any) {
    const raw = JSON.stringify(payload);
    for (const [ws, meta] of this.clientMetas.entries()) {
      if (meta.role === 'admin' && ws.readyState === WebSocket.OPEN) {
        ws.send(raw);
      }
    }
  }

  public broadcastAll(payload: any) {
    const raw = JSON.stringify(payload);
    for (const [ws] of this.clientMetas.entries()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(raw);
      }
    }
  }
}
