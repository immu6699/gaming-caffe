import { Router } from 'express';
import { db } from '../db';
import type { WebSocketHub } from '../websocket';

export function createApiRouter(hub: WebSocketHub) {
  const router = Router();

  // Health
  router.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'QHAR Gaming Cafe Master API',
      timestamp: new Date().toISOString(),
      activeStations: db.getStations().filter(s => s.status === 'In Use').length,
      totalStations: db.getStations().length
    });
  });

  // Branches
  router.get('/branches', (req, res) => {
    res.json(db.getBranches());
  });

  // Stations
  router.get('/stations', (req, res) => {
    res.json(db.getStations());
  });

  router.get('/stations/:id', (req, res) => {
    const station = db.getStation(req.params.id);
    if (!station) return res.status(404).json({ error: 'Station not found' });
    const activeSession = db.getSessions().find(s => s.stationId === req.params.id && s.status === 'Active');
    res.json({ station, activeSession });
  });

  // Unlock Station / Start Session
  router.post('/stations/:id/unlock', (req, res) => {
    try {
      const { customerName, customerPhone, durationHours, hourlyRate, paymentMethod } = req.body;
      const session = db.startSession({
        stationId: req.params.id,
        customerName: customerName || 'Walk-in Gamer',
        customerPhone,
        durationHours: durationHours || 1,
        hourlyRate,
        paymentMethod: paymentMethod || 'UPI'
      });

      // Push real-time unlock to the client station screen
      hub.sendToStation(req.params.id, {
        type: 'UNLOCK_STATION',
        stationId: req.params.id,
        session
      });

      // Broadcast update to all admin counters
      hub.broadcastToAdmins({
        type: 'STATIONS_UPDATED',
        stations: db.getStations(),
        eventNote: `Station ${req.params.id} unlocked for ${session.customerName}`
      });

      res.status(201).json({ success: true, session, station: db.getStation(req.params.id) });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Lock Station / End Session
  router.post('/stations/:id/lock', (req, res) => {
    try {
      const { paymentMethod, reason } = req.body;
      const session = db.getSessions().find(s => s.stationId === req.params.id && s.status === 'Active');
      let result = null;

      if (session) {
        result = db.endSession(session.id, paymentMethod || 'Cash');
      } else {
        db.updateStation(req.params.id, { status: 'Available', currentSessionId: undefined });
      }

      // Push real-time lock to the client station screen
      hub.sendToStation(req.params.id, {
        type: 'LOCK_STATION',
        stationId: req.params.id,
        reason: reason || 'Session ended by counter attendant'
      });

      // Broadcast update to admins
      hub.broadcastToAdmins({
        type: 'STATIONS_UPDATED',
        stations: db.getStations(),
        eventNote: `Station ${req.params.id} locked`
      });

      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Call Desk Attendant
  router.post('/stations/:id/call-attendant', (req, res) => {
    const { reason, stationName } = req.body;
    hub.broadcastToAdmins({
      type: 'ATTENDANT_CALL_ALERT',
      stationId: req.params.id,
      stationName: stationName || req.params.id,
      reason: reason || 'Gamer requested counter assistance',
      timestamp: new Date().toISOString()
    });
    res.json({ success: true, message: 'Attendant alert dispatched to counter' });
  });

  // Sessions
  router.get('/sessions', (req, res) => {
    res.json(db.getSessions());
  });

  router.post('/sessions/start', (req, res) => {
    try {
      const session = db.startSession(req.body);
      hub.sendToStation(session.stationId, {
        type: 'UNLOCK_STATION',
        stationId: session.stationId,
        session
      });
      hub.broadcastToAdmins({
        type: 'STATIONS_UPDATED',
        stations: db.getStations()
      });
      res.status(201).json(session);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  router.post('/sessions/:id/extend', (req, res) => {
    try {
      const { minutes } = req.body;
      const session = db.extendSession(req.params.id, minutes || 30);

      hub.sendToStation(session.stationId, {
        type: 'SESSION_EXTENDED',
        stationId: session.stationId,
        minutes: minutes || 30,
        scheduledEndTime: session.scheduledEndTime,
        newEstimatedCharge: session.estimatedCharge
      });

      hub.broadcastToAdmins({
        type: 'STATIONS_UPDATED',
        stations: db.getStations(),
        eventNote: `${session.stationName} extended by +${minutes || 30} mins`
      });

      res.json(session);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  router.post('/sessions/:id/end', (req, res) => {
    try {
      const { paymentMethod } = req.body;
      const result = db.endSession(req.params.id, paymentMethod || 'UPI');

      hub.sendToStation(result.session.stationId, {
        type: 'LOCK_STATION',
        stationId: result.session.stationId,
        reason: 'Session completed at counter'
      });

      hub.broadcastToAdmins({
        type: 'STATIONS_UPDATED',
        stations: db.getStations()
      });

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Customers
  router.get('/customers', (req, res) => {
    res.json(db.getCustomers());
  });

  // F&B Menu & Orders
  router.get('/fnb/menu', (req, res) => {
    res.json(db.getMenuItems());
  });

  router.get('/fnb/orders', (req, res) => {
    res.json(db.getFnbOrders());
  });

  router.post('/fnb/orders', (req, res) => {
    try {
      const order = db.createFnbOrder(req.body);
      hub.broadcastToAdmins({
        type: 'NEW_FNB_ORDER',
        order
      });
      res.status(201).json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Invoices & Billing
  router.get('/billing/invoices', (req, res) => {
    res.json(db.getInvoices());
  });

  // Cafe PA Counter Broadcast
  router.post('/broadcast/pa', (req, res) => {
    const { message } = req.body;
    hub.broadcastAll({
      type: 'CAFE_PA_BROADCAST',
      message: message || 'Attention gamers, cafe announcement.',
      timestamp: new Date().toISOString()
    });
    res.json({ success: true, message: 'Voice announcement broadcast to all stations' });
  });

  // 5-Min Warning Manual Broadcast
  router.post('/broadcast/5min-warning', (req, res) => {
    hub.broadcastToStations({
      type: 'WARNING_5MIN',
      stationId: 'ALL',
      minutesLeft: 5
    });
    res.json({ success: true, message: '5-minute warning alert sent to stations' });
  });

  return router;
}
