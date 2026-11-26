// Frontend WebSocket Client for QHAR Gaming Cafe LAN
import { sound } from '../utils/audio';

type MessageHandler = (msg: any) => void;

class GamingCafeWebSocketClient {
  private ws: WebSocket | null = null;
  private handlers = new Set<MessageHandler>();
  private reconnectTimer: any = null;
  private currentRole: 'admin' | 'station' = 'admin';
  private currentStationId?: string;
  public isConnected = false;

  constructor() {
    this.connect();
  }

  private getWsUrl(): string {
    const host = window.location.hostname || 'localhost';
    // Port 5000 is our backend server
    return `ws://${host}:5000/ws`;
  }

  public connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const url = this.getWsUrl();
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.isConnected = true;
        console.log('✅ Connected to Gaming Cafe Master LAN WebSocket');
        // Re-register if role was set
        this.register(this.currentRole, this.currentStationId);
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleIncoming(msg);
        } catch (e) {
          console.error('Failed to parse WS message:', e);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        // Silent fail on dev if server is not yet started
        this.isConnected = false;
      };
    } catch (e) {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, 4000);
  }

  private handleIncoming(msg: any) {
    // Global audio triggers
    if (msg.type === 'CAFE_PA_BROADCAST' && msg.message) {
      sound.speakCafePA(msg.message);
    }

    if (msg.type === 'ATTENDANT_CALL_ALERT') {
      sound.playAlert();
    }

    // Notify all registered listeners
    this.handlers.forEach((fn) => {
      try {
        fn(msg);
      } catch (err) {
        console.error('WS handler error:', err);
      }
    });
  }

  public register(role: 'admin' | 'station', stationId?: string) {
    this.currentRole = role;
    this.currentStationId = stationId;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'REGISTER',
        role,
        stationId
      }));
    }
  }

  public subscribe(handler: MessageHandler): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  public send(msg: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    } else {
      console.warn('WS not open, message queued/dropped:', msg.type);
    }
  }

  // Station Actions
  public requestExtend(stationId: string, minutes: number, customerName?: string) {
    this.send({
      type: 'CLIENT_REQUEST_EXTEND',
      stationId,
      minutes,
      customerName
    });
  }

  public callAttendant(stationId: string, stationName?: string, reason?: string) {
    this.send({
      type: 'CLIENT_CALL_ATTENDANT',
      stationId,
      stationName,
      reason: reason || 'Assistance requested at desk'
    });
  }

  // Admin Actions
  public unlockStation(stationId: string, durationHours = 1, customerName = 'Gamer', hourlyRate = 50) {
    this.send({
      type: 'ADMIN_UNLOCK_STATION',
      stationId,
      durationHours,
      customerName,
      hourlyRate
    });
  }

  public lockStation(stationId: string, reason = 'Admin Lock') {
    this.send({
      type: 'ADMIN_LOCK_STATION',
      stationId,
      reason
    });
  }

  public broadcastPA(message: string) {
    this.send({
      type: 'ADMIN_BROADCAST_PA',
      message
    });
  }

  public broadcast5MinWarning() {
    this.send({
      type: 'ADMIN_BROADCAST_5MIN_WARNING'
    });
  }
}

export const wsClient = new GamingCafeWebSocketClient();
