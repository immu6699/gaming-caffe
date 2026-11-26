import express from 'express';
import http from 'http';
import cors from 'cors';
import os from 'os';
import { WebSocketHub } from './websocket';
import { createApiRouter } from './routes/api';

const app = express();
const server = http.createServer(app);

// Enable CORS for all local LAN devices & Vite client
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Branch-ID']
}));

app.use(express.json());

// Initialize WebSocket Master Hub
const wsHub = new WebSocketHub(server);

// Mount REST API
app.use('/api/v1', createApiRouter(wsHub));

// Root info
app.get('/', (req, res) => {
  res.json({
    name: 'QHAR Gaming Cafe LAN Master Server',
    version: '1.0.0',
    documentation: '/api/v1/health',
    websocket: '/ws'
  });
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// Discover LAN IP addresses
function getLocalIpAddresses(): string[] {
  const interfaces = os.networkInterfaces();
  const addresses: string[] = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses;
}

server.listen(PORT, '0.0.0.0', () => {
  const localIps = getLocalIpAddresses();
  console.log(`\n==========================================================`);
  console.log(`🎮 QHAR GAMING CAFE - MASTER LAN SERVER ACTIVE`);
  console.log(`==========================================================`);
  console.log(`⚡ Local Counter PC:  http://localhost:${PORT}`);
  localIps.forEach(ip => {
    console.log(`🌐 LAN Station Access: http://${ip}:${PORT}`);
    console.log(`📡 LAN WebSocket URL:  ws://${ip}:${PORT}/ws`);
  });
  console.log(`==========================================================\n`);
});
