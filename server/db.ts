import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.resolve(DATA_DIR, 'gaming_cafe_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface DatabaseSchema {
  branches: any[];
  stations: any[];
  sessions: any[];
  bookings: any[];
  customers: any[];
  invoices: any[];
  menuItems: any[];
  fnbOrders: any[];
  stockItems: any[];
  lanChallenges: any[];
  rigHealth: any[];
  lastUpdated: string;
}

// Initial 20 battle stations seed
const defaultStations = [
  {
    id: 'st-01',
    name: 'PC-01 [Standard Esports]',
    type: 'PC',
    branchId: 'branch-1',
    status: 'In Use',
    hourlyRate: 50,
    specs: { gpu: 'RTX 4060 Ti 8GB', cpu: 'Ryzen 5 7600X', ram: '32GB DDR5 5600', monitor: '24" 180Hz IPS FHD', peripherals: 'Razer DeathAdder + Mechanical Blue' },
    currentSessionId: 'sess-01',
    currentCustomerName: 'Devansh Roy',
    currentCustomerId: 'cust-1',
    sessionStartTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    scheduledEndTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    totalHoursUsed: 420
  },
  {
    id: 'st-02',
    name: 'PC-02 [Standard Esports]',
    type: 'PC',
    branchId: 'branch-1',
    status: 'In Use',
    hourlyRate: 50,
    specs: { gpu: 'RTX 4060 Ti 8GB', cpu: 'Ryzen 5 7600X', ram: '32GB DDR5 5600', monitor: '24" 180Hz IPS FHD', peripherals: 'Razer DeathAdder + Mechanical Blue' },
    currentSessionId: 'sess-02',
    currentCustomerName: 'Vikram Seth',
    currentCustomerId: 'cust-2',
    sessionStartTime: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    scheduledEndTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    totalHoursUsed: 395
  },
  {
    id: 'st-03',
    name: 'PC-03 [Standard Esports]',
    type: 'PC',
    branchId: 'branch-1',
    status: 'Available',
    hourlyRate: 50,
    specs: { gpu: 'RTX 4060 Ti 8GB', cpu: 'Ryzen 5 7600X', ram: '32GB DDR5 5600', monitor: '24" 180Hz IPS FHD', peripherals: 'Razer DeathAdder + Mechanical Blue' },
    totalHoursUsed: 310
  },
  {
    id: 'st-04',
    name: 'PC-04 [VIP Battle Rig]',
    type: 'PC',
    branchId: 'branch-1',
    status: 'In Use',
    hourlyRate: 70,
    specs: { gpu: 'RTX 4080 Super 16GB', cpu: 'Intel i7 14700KF', ram: '32GB DDR5 6000', monitor: '27" 240Hz Fast IPS 2K', peripherals: 'Logitech G Pro X Superlight + Ducky One 3' },
    currentSessionId: 'sess-04',
    currentCustomerName: 'Kabir Singhania',
    currentCustomerId: 'cust-3',
    sessionStartTime: new Date(Date.now() - 56 * 60 * 1000).toISOString(),
    scheduledEndTime: new Date(Date.now() + 4 * 60 * 1000).toISOString(), // 4 mins left -> warning active!
    totalHoursUsed: 540
  },
  {
    id: 'st-05',
    name: 'PC-05 [VIP Battle Rig]',
    type: 'PC',
    branchId: 'branch-1',
    status: 'Available',
    hourlyRate: 70,
    specs: { gpu: 'RTX 4080 Super 16GB', cpu: 'Intel i7 14700KF', ram: '32GB DDR5 6000', monitor: '27" 240Hz Fast IPS 2K', peripherals: 'Logitech G Pro X Superlight + Ducky One 3' },
    totalHoursUsed: 490
  },
  {
    id: 'st-06',
    name: 'PC-06 [VIP Battle Rig]',
    type: 'PC',
    branchId: 'branch-1',
    status: 'Available',
    hourlyRate: 70,
    specs: { gpu: 'RTX 4080 Super 16GB', cpu: 'Intel i7 14700KF', ram: '32GB DDR5 6000', monitor: '27" 240Hz Fast IPS 2K', peripherals: 'Logitech G Pro X Superlight + Ducky One 3' },
    totalHoursUsed: 460
  },
  {
    id: 'st-07',
    name: 'PC-07 [Tournament Rig]',
    type: 'PC',
    branchId: 'branch-1',
    status: 'Available',
    hourlyRate: 60,
    specs: { gpu: 'RTX 4070 Ti Super', cpu: 'Ryzen 7 7800X3D', ram: '32GB DDR5', monitor: '27" 280Hz Asus ROG', peripherals: 'Wooting 60HE + Pulsar X2' },
    totalHoursUsed: 380
  },
  {
    id: 'st-08',
    name: 'PC-08 [Tournament Rig]',
    type: 'PC',
    branchId: 'branch-1',
    status: 'In Use',
    hourlyRate: 60,
    specs: { gpu: 'RTX 4070 Ti Super', cpu: 'Ryzen 7 7800X3D', ram: '32GB DDR5', monitor: '27" 280Hz Asus ROG', peripherals: 'Wooting 60HE + Pulsar X2' },
    currentSessionId: 'sess-08',
    currentCustomerName: 'Aman Joshi',
    currentCustomerId: 'cust-4',
    sessionStartTime: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    scheduledEndTime: new Date(Date.now() + 40 * 60 * 1000).toISOString(),
    totalHoursUsed: 310
  },
  {
    id: 'st-09',
    name: 'PC-09 [Tournament Rig]',
    type: 'PC',
    branchId: 'branch-1',
    status: 'Available',
    hourlyRate: 60,
    specs: { gpu: 'RTX 4070 Ti Super', cpu: 'Ryzen 7 7800X3D', ram: '32GB DDR5', monitor: '27" 280Hz Asus ROG', peripherals: 'Wooting 60HE + Pulsar X2' },
    totalHoursUsed: 295
  },
  {
    id: 'st-10',
    name: 'PC-10 [Tournament Rig]',
    type: 'PC',
    branchId: 'branch-1',
    status: 'Maintenance',
    hourlyRate: 60,
    specs: { gpu: 'RTX 4070 Ti Super', cpu: 'Ryzen 7 7800X3D', ram: '32GB DDR5', monitor: '27" 280Hz Asus ROG', peripherals: 'Wooting 60HE + Pulsar X2' },
    totalHoursUsed: 520
  },
  {
    id: 'st-11',
    name: 'PC-11 [Standard Esports]',
    type: 'PC',
    branchId: 'branch-1',
    status: 'Available',
    hourlyRate: 50,
    specs: { gpu: 'RTX 4060 Ti 8GB', cpu: 'Ryzen 5 7600X', ram: '32GB DDR5', monitor: '24" 180Hz IPS FHD', peripherals: 'Razer DeathAdder' },
    totalHoursUsed: 240
  },
  {
    id: 'st-12',
    name: 'PC-12 [Standard Esports]',
    type: 'PC',
    branchId: 'branch-1',
    status: 'Available',
    hourlyRate: 50,
    specs: { gpu: 'RTX 4060 Ti 8GB', cpu: 'Ryzen 5 7600X', ram: '32GB DDR5', monitor: '24" 180Hz IPS FHD', peripherals: 'Razer DeathAdder' },
    totalHoursUsed: 210
  },
  {
    id: 'st-13',
    name: 'PC-13 [Standard Esports]',
    type: 'PC',
    branchId: 'branch-1',
    status: 'Available',
    hourlyRate: 50,
    specs: { gpu: 'RTX 4060 Ti 8GB', cpu: 'Ryzen 5 7600X', ram: '32GB DDR5', monitor: '24" 180Hz IPS FHD', peripherals: 'Razer DeathAdder' },
    totalHoursUsed: 190
  },
  {
    id: 'st-14',
    name: 'PC-14 [Standard Esports]',
    type: 'PC',
    branchId: 'branch-1',
    status: 'Available',
    hourlyRate: 50,
    specs: { gpu: 'RTX 4060 Ti 8GB', cpu: 'Ryzen 5 7600X', ram: '32GB DDR5', monitor: '24" 180Hz IPS FHD', peripherals: 'Razer DeathAdder' },
    totalHoursUsed: 180
  },
  {
    id: 'st-15',
    name: 'PC-15 [Standard Esports]',
    type: 'PC',
    branchId: 'branch-1',
    status: 'Available',
    hourlyRate: 50,
    specs: { gpu: 'RTX 4060 Ti 8GB', cpu: 'Ryzen 5 7600X', ram: '32GB DDR5', monitor: '24" 180Hz IPS FHD', peripherals: 'Razer DeathAdder' },
    totalHoursUsed: 175
  },
  {
    id: 'st-16',
    name: 'PC-16 [Retro & LAN Classic]',
    type: 'PC',
    branchId: 'branch-1',
    status: 'Available',
    hourlyRate: 40,
    specs: { gpu: 'RTX 3060 12GB', cpu: 'Core i5 12400F', ram: '16GB DDR4', monitor: '24" 144Hz FHD', peripherals: 'Logitech G102' },
    totalHoursUsed: 620
  },
  {
    id: 'st-17',
    name: 'PC-17 [Retro & LAN Classic]',
    type: 'PC',
    branchId: 'branch-1',
    status: 'Available',
    hourlyRate: 40,
    specs: { gpu: 'RTX 3060 12GB', cpu: 'Core i5 12400F', ram: '16GB DDR4', monitor: '24" 144Hz FHD', peripherals: 'Logitech G102' },
    totalHoursUsed: 590
  },
  {
    id: 'st-18',
    name: 'PC-18 [Apex Streamer Booth]',
    type: 'PC',
    branchId: 'branch-1',
    status: 'Available',
    hourlyRate: 85,
    specs: { gpu: 'RTX 4090 24GB', cpu: 'Intel i9 14900K', ram: '64GB DDR5', monitor: 'Dual 27" 360Hz + Shure SM7B Mic', peripherals: 'Elgato StreamDeck + Cam Link' },
    totalHoursUsed: 710
  },
  {
    id: 'st-19',
    name: 'Console-01 [PS5 Pro Lounge]',
    type: 'Console',
    branchId: 'branch-1',
    status: 'In Use',
    hourlyRate: 60,
    specs: { consoleModel: 'PlayStation 5 Pro 2TB', monitor: '55" OLED 120Hz 4K HDR', peripherals: '2x DualSense Edge Controllers' },
    currentSessionId: 'sess-19',
    currentCustomerName: 'Rohan & Samar',
    currentCustomerId: 'cust-5',
    sessionStartTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    scheduledEndTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    totalHoursUsed: 840
  },
  {
    id: 'st-20',
    name: 'Sim-01 [F1 Motion Cockpit]',
    type: 'Racing Sim',
    branchId: 'branch-1',
    status: 'Available',
    hourlyRate: 120,
    specs: { gpu: 'RTX 4080 Super', monitor: '49" Samsung Odyssey G9 Dual QHD Curved', peripherals: 'Fanatec ClubSport DD+ Wheel Base + Loadcell Pedals' },
    totalHoursUsed: 430
  }
];

const defaultBranches = [
  {
    id: 'branch-1',
    name: 'Downtown Flagship Arena',
    code: 'QHAR-DT01',
    address: 'Plot 42, Brigade Road, Commercial Hub',
    city: 'Bengaluru',
    contactNumber: '+91 98450 11223',
    email: 'downtown@qhargamingcaffe.com',
    managerName: 'Arjun Mehta',
    totalStations: 20,
    activeSessions: 5,
    todayRevenue: 28400,
    status: 'Active',
    openingHours: '10:00 AM - 03:00 AM',
    gstin: '29AABCR1234F1Z5'
  }
];

const defaultCustomers = [
  {
    id: 'cust-1',
    name: 'Devansh Roy',
    email: 'devansh.roy@gmail.com',
    phone: '+91 98765 43210',
    registrationDate: '2025-06-12',
    totalBookings: 24,
    totalHoursPlayed: 78,
    totalSpending: 4680,
    lastVisit: 'Today',
    status: 'VIP',
    preferredStationType: 'PC',
    walletBalance: 450,
    gamerTag: 'ViperX',
    loyaltyXP: 3820,
    streakDays: 4
  },
  {
    id: 'cust-2',
    name: 'Vikram Seth',
    email: 'vikram.seth@outlook.com',
    phone: '+91 98123 45678',
    registrationDate: '2025-08-20',
    totalBookings: 14,
    totalHoursPlayed: 42,
    totalSpending: 2520,
    lastVisit: 'Today',
    status: 'Active',
    preferredStationType: 'PC',
    walletBalance: 200,
    gamerTag: 'GhostRider',
    loyaltyXP: 2100,
    streakDays: 2
  },
  {
    id: 'cust-3',
    name: 'Kabir Singhania',
    email: 'kabir.s@techcorp.in',
    phone: '+91 97234 56789',
    registrationDate: '2025-04-10',
    totalBookings: 45,
    totalHoursPlayed: 160,
    totalSpending: 11200,
    lastVisit: 'Today',
    status: 'VIP',
    preferredStationType: 'PC',
    walletBalance: 1250,
    gamerTag: 'CyberKnight',
    loyaltyXP: 8900,
    streakDays: 12
  }
];

const defaultMenuItems = [
  {
    id: 'menu-1',
    sku: 'FNB-MAG-01',
    name: 'Classic Masala Cheese Maggi',
    description: 'Double butter, authentic desi masala with melted Amul cheese',
    category: 'Fast Food',
    sellingPrice: 90,
    costPrice: 32,
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80',
    availability: 'Available',
    prepTimeMinutes: 7,
    isVegetarian: true,
    spiceLevel: 'Medium',
    stockQuantity: 84,
    lowStockThreshold: 15
  },
  {
    id: 'menu-2',
    sku: 'FNB-RB-01',
    name: 'Red Bull Energy 250ml (Chilled)',
    description: 'Vitalizes body and mind for intense clutch moments',
    category: 'Energy Drinks',
    sellingPrice: 125,
    costPrice: 92,
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80',
    availability: 'Available',
    prepTimeMinutes: 1,
    isVegetarian: true,
    stockQuantity: 48,
    lowStockThreshold: 12
  },
  {
    id: 'menu-3',
    sku: 'FNB-BUR-01',
    name: 'Crispy Peri-Peri Chicken Burger',
    description: 'Crunchy fried chicken thigh, spicy mayo & jalapenos in brioche bun',
    category: 'Fast Food',
    sellingPrice: 160,
    costPrice: 65,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
    availability: 'Available',
    prepTimeMinutes: 12,
    isVegetarian: false,
    spiceLevel: 'Spicy',
    stockQuantity: 32,
    lowStockThreshold: 8
  },
  {
    id: 'menu-4',
    sku: 'FNB-TEA-01',
    name: 'Kulhad Elaichi Chai (Double Cut)',
    description: 'Freshly brewed ginger-cardamom cutting chai in clay kulhad',
    category: 'Hot Beverages',
    sellingPrice: 35,
    costPrice: 9,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80',
    availability: 'Available',
    prepTimeMinutes: 5,
    isVegetarian: true,
    stockQuantity: 150,
    lowStockThreshold: 20
  }
];

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('Error reading DB file, reinitializing default seed:', err);
      }
    }

    const initial: DatabaseSchema = {
      branches: defaultBranches,
      stations: defaultStations,
      sessions: [
        {
          id: 'sess-01',
          stationId: 'st-01',
          stationName: 'PC-01 [Standard Esports]',
          stationType: 'PC',
          branchId: 'branch-1',
          customerId: 'cust-1',
          customerName: 'Devansh Roy',
          customerPhone: '+91 98765 43210',
          startTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          scheduledEndTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          hourlyRate: 50,
          estimatedCharge: 50,
          paymentStatus: 'Paid',
          paymentMethod: 'UPI',
          status: 'Active',
          notes: 'Competitive Valorant Grinding'
        },
        {
          id: 'sess-04',
          stationId: 'st-04',
          stationName: 'PC-04 [VIP Battle Rig]',
          stationType: 'PC',
          branchId: 'branch-1',
          customerId: 'cust-3',
          customerName: 'Kabir Singhania',
          customerPhone: '+91 97234 56789',
          startTime: new Date(Date.now() - 56 * 60 * 1000).toISOString(),
          scheduledEndTime: new Date(Date.now() + 4 * 60 * 1000).toISOString(),
          hourlyRate: 70,
          estimatedCharge: 70,
          paymentStatus: 'Paid',
          paymentMethod: 'UPI',
          status: 'Active',
          notes: 'Cyberpunk 2077 Max Settings'
        }
      ],
      bookings: [],
      customers: defaultCustomers,
      invoices: [],
      menuItems: defaultMenuItems,
      fnbOrders: [],
      stockItems: [],
      lanChallenges: [],
      rigHealth: [],
      lastUpdated: new Date().toISOString()
    };

    this.save(initial);
    return initial;
  }

  public save(data?: DatabaseSchema) {
    if (data) this.data = data;
    this.data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  public getStations() {
    return this.data.stations;
  }

  public getStation(id: string) {
    return this.data.stations.find((s) => s.id === id);
  }

  public updateStation(id: string, updates: any) {
    const idx = this.data.stations.findIndex((s) => s.id === id);
    if (idx !== -1) {
      this.data.stations[idx] = { ...this.data.stations[idx], ...updates };
      this.save();
      return this.data.stations[idx];
    }
    return null;
  }

  public getSessions() {
    return this.data.sessions;
  }

  public getSession(id: string) {
    return this.data.sessions.find((s) => s.id === id);
  }

  public startSession(data: {
    stationId: string;
    customerName: string;
    customerPhone?: string;
    durationHours: number;
    hourlyRate?: number;
    paymentMethod?: string;
  }) {
    const station = this.getStation(data.stationId);
    if (!station) throw new Error('Station not found');

    const now = new Date();
    const durationHours = data.durationHours || 1;
    const endTime = new Date(now.getTime() + durationHours * 60 * 60 * 1000);
    const rate = data.hourlyRate || station.hourlyRate || 50;

    const newSession = {
      id: `sess-${Date.now()}`,
      stationId: station.id,
      stationName: station.name,
      stationType: station.type,
      branchId: station.branchId,
      customerId: `cust-${Date.now().toString().slice(-4)}`,
      customerName: data.customerName || 'Walk-in Gamer',
      customerPhone: data.customerPhone || '',
      startTime: now.toISOString(),
      scheduledEndTime: endTime.toISOString(),
      hourlyRate: rate,
      estimatedCharge: rate * durationHours,
      paymentStatus: 'Paid',
      paymentMethod: data.paymentMethod || 'UPI',
      status: 'Active'
    };

    this.data.sessions.push(newSession);

    // Update station
    this.updateStation(station.id, {
      status: 'In Use',
      currentSessionId: newSession.id,
      currentCustomerName: newSession.customerName,
      sessionStartTime: newSession.startTime,
      scheduledEndTime: newSession.scheduledEndTime
    });

    this.save();
    return newSession;
  }

  public extendSession(sessionId: string, additionalMinutes: number) {
    const session = this.getSession(sessionId);
    if (!session) throw new Error('Session not found');

    const currentEnd = new Date(session.scheduledEndTime).getTime();
    const newEnd = new Date(Math.max(Date.now(), currentEnd) + additionalMinutes * 60 * 1000);

    const addedHours = additionalMinutes / 60;
    const addedCharge = session.hourlyRate * addedHours;

    session.scheduledEndTime = newEnd.toISOString();
    session.estimatedCharge += addedCharge;
    session.warned5Min = false; // reset 5min warning flag

    // update station
    this.updateStation(session.stationId, {
      scheduledEndTime: session.scheduledEndTime
    });

    this.save();
    return session;
  }

  public endSession(sessionId: string, paymentMethod = 'UPI') {
    const session = this.getSession(sessionId);
    if (!session) throw new Error('Session not found');

    session.status = 'Completed';
    session.actualEndTime = new Date().toISOString();
    session.paymentMethod = paymentMethod;

    // Create Invoice
    const invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      referenceType: 'Session',
      referenceId: session.id,
      customerName: session.customerName,
      customerPhone: session.customerPhone,
      branchId: session.branchId,
      items: [
        {
          description: `${session.stationName} Gaming Session`,
          type: 'Gaming',
          quantity: 1,
          rate: session.estimatedCharge,
          amount: session.estimatedCharge
        }
      ],
      subtotal: session.estimatedCharge,
      taxAmount: Math.round(session.estimatedCharge * 0.18),
      discountAmount: 0,
      totalAmount: Math.round(session.estimatedCharge * 1.18),
      amountPaid: Math.round(session.estimatedCharge * 1.18),
      outstandingAmount: 0,
      paymentMethod: paymentMethod,
      paymentStatus: 'Paid',
      createdAt: new Date().toISOString()
    };

    this.data.invoices.push(invoice);

    // Free station
    this.updateStation(session.stationId, {
      status: 'Available',
      currentSessionId: undefined,
      currentCustomerName: undefined,
      currentCustomerId: undefined,
      sessionStartTime: undefined,
      scheduledEndTime: undefined
    });

    this.save();
    return { session, invoice };
  }

  public getCustomers() {
    return this.data.customers;
  }

  public getMenuItems() {
    return this.data.menuItems;
  }

  public getFnbOrders() {
    return this.data.fnbOrders;
  }

  public createFnbOrder(order: any) {
    const newOrder = {
      id: `fnb-${Date.now()}`,
      orderNumber: `ORD-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      orderStatus: 'New',
      ...order
    };
    this.data.fnbOrders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  public getInvoices() {
    return this.data.invoices;
  }

  public getBranches() {
    return this.data.branches;
  }
}

export const db = new DatabaseManager();
