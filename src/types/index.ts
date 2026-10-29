// Data Types for QHAR GamingCaffe Admin Panel

export type StationType = 'PC' | 'Console' | 'VR' | 'Racing Sim';

export type StationStatus = 'Available' | 'In Use' | 'Booked' | 'Maintenance' | 'Offline';

export interface GamingStation {
  id: string;
  name: string;
  type: StationType;
  branchId: string;
  status: StationStatus;
  hourlyRate: number;
  specs: {
    gpu?: string;
    cpu?: string;
    ram?: string;
    monitor?: string;
    consoleModel?: string; // PS5, Xbox Series X, Nintendo Switch OLED
    peripherals?: string;
  };
  currentSessionId?: string;
  currentCustomerName?: string;
  currentCustomerId?: string;
  sessionStartTime?: string;
  scheduledEndTime?: string;
  totalHoursUsed?: number;
}

export interface LiveSession {
  id: string;
  stationId: string;
  stationName: string;
  stationType: StationType;
  branchId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  startTime: string; // ISO string
  scheduledEndTime: string; // ISO string
  actualEndTime?: string;
  hourlyRate: number;
  estimatedCharge: number;
  paymentStatus: 'Pending' | 'Paid' | 'Partially Paid';
  paymentMethod?: 'UPI' | 'Card' | 'Cash' | 'NetBanking' | 'Wallet';
  notes?: string;
  status: 'Active' | 'Completed' | 'Overdue';
  fnbOrderIds?: string[];
  totalFnbAmount?: number;
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  branchId: string;
  stationId: string;
  stationName: string;
  stationType: StationType;
  bookingDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  durationHours: number;
  status: 'Confirmed' | 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  totalAmount: number;
  specialRequests?: string;
  cancellationReason?: string;
  createdAt: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  contactNumber: string;
  email: string;
  managerName: string;
  totalStations: number;
  activeSessions: number;
  todayRevenue: number;
  status: 'Active' | 'Under Maintenance' | 'Closed';
  openingHours: string;
  gstin: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  totalBookings: number;
  totalHoursPlayed: number;
  totalSpending: number;
  lastVisit: string;
  status: 'Active' | 'VIP' | 'Suspended';
  preferredStationType: StationType;
  notes?: string;
  walletBalance: number;
  // Human Gamer Attributes
  gamerTag?: string;
  gameRanks?: {
    game: string;
    rank: string;
    rating?: string;
  }[];
  favoritePerk?: string;
  preferredSeat?: string;
  loyaltyXP?: number;
  streakDays?: number;
  birthday?: string;
}

export interface InvoiceItem {
  description: string;
  type: 'Gaming' | 'F&B' | 'Extra';
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  referenceType: 'Session' | 'Booking' | 'POS_FNB' | 'Combined';
  referenceId: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  branchId: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number; // GST 18% or 5%
  discountAmount: number;
  totalAmount: number;
  amountPaid: number;
  outstandingAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'Cash' | 'NetBanking' | 'Split';
  paymentStatus: 'Paid' | 'Pending' | 'Partially Paid' | 'Refunded';
  transactionRef?: string;
  createdAt: string;
  refundReason?: string;
}

export interface PricingRule {
  id: string;
  category: 'PC_Standard' | 'PC_VIP' | 'Console_PS5' | 'Console_Xbox' | 'VR';
  name: string;
  baseHourlyRate: number;
  weekendRate: number;
  peakHourRate: number;
  peakHoursStart: string; // e.g. "18:00"
  peakHoursEnd: string; // e.g. "23:00"
  minBookingHours: number;
  taxRatePercent: number; // 18%
  branchOverrides?: Record<string, number>;
}

export type StaffRole = 
  | 'Super Admin' 
  | 'Cafe Owner' 
  | 'Branch Manager' 
  | 'Cashier' 
  | 'Kitchen Staff' 
  | 'Technician';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  branchAccess: string[]; // branchIds or ['ALL']
  status: 'Active' | 'Inactive';
  lastActive: string;
  permissions: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'booking' | 'payment' | 'fnb' | 'system';
  severity: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  branchId?: string;
}

// ----------------- Food & Beverages (F&B) Types ----------------- //

export type FnbCategory = 
  | 'Snacks' 
  | 'Fast Food' 
  | 'Meals' 
  | 'Hot Beverages' 
  | 'Cold Beverages' 
  | 'Energy Drinks' 
  | 'Desserts';

export interface MenuItemVariant {
  name: string;
  priceDelta: number;
}

export interface MenuItemAddon {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: FnbCategory;
  sellingPrice: number;
  costPrice: number;
  imageUrl: string;
  availability: 'Available' | 'Out of Stock' | 'Temporarily Unavailable';
  prepTimeMinutes: number;
  isVegetarian: boolean;
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy';
  variants?: MenuItemVariant[];
  addons?: MenuItemAddon[];
  stockQuantity: number;
  lowStockThreshold: number;
  branchId?: string;
}

export type FnbOrderStatus = 
  | 'New' 
  | 'Accepted' 
  | 'Preparing' 
  | 'Ready' 
  | 'Served / Delivered' 
  | 'Cancelled';

export interface FnbOrderItem {
  menuItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  selectedVariant?: string;
  selectedAddons?: string[];
  totalPrice: number;
  specialInstructions?: string;
}

export interface FnbOrder {
  id: string;
  orderNumber: string;
  orderType: 'Counter Pickup' | 'Station Delivery' | 'Walk-in';
  branchId: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  stationId?: string;
  stationName?: string;
  sessionId?: string; // Linked gaming session
  items: FnbOrderItem[];
  subtotal: number;
  discount: number;
  tax: number; // 5% GST on F&B
  total: number;
  paymentMethod: 'UPI' | 'Card' | 'Cash' | 'Add to Gaming Bill' | 'Wallet';
  paymentStatus: 'Paid' | 'Pending' | 'Added to Bill' | 'Refunded';
  orderStatus: FnbOrderStatus;
  createdAt: string;
  acceptedAt?: string;
  preparedAt?: string;
  deliveredAt?: string;
  cancellationReason?: string;
  notes?: string;
}

export interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: 'Packaged Goods' | 'Raw Ingredients' | 'Beverages' | 'Disposables';
  unit: 'units' | 'kg' | 'liters' | 'cans' | 'packets';
  currentStock: number;
  minThreshold: number;
  costPerUnit: number;
  branchId: string;
  supplierName: string;
  lastRestocked: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface StockMovement {
  id: string;
  stockItemId: string;
  stockItemName: string;
  type: 'Received' | 'Used in Order' | 'Wasted' | 'Manual Adjustment';
  quantityChange: number;
  reason: string;
  recordedBy: string;
  timestamp: string;
}

// ----------------- Human Touch & Lounge Experience Models ----------------- //

export type StickyNoteColor = 'amber' | 'emerald' | 'cyan' | 'purple' | 'rose';

export interface ShiftStickyNote {
  id: string;
  title: string;
  content: string;
  author: string;
  color: StickyNoteColor;
  pinned: boolean;
  tag: 'Maintenance' | 'VIP Customer' | 'F&B Alert' | 'Handover' | 'Tournament';
  createdAt: string;
}

export interface LostAndFoundItem {
  id: string;
  itemName: string;
  category: 'Electronics' | 'Accessories' | 'ID Cards / Wallet' | 'Apparel' | 'Other';
  foundLocation: string; // e.g. "PC-04", "Console Suite B Couch"
  foundAt: string;
  reportedBy: string;
  status: 'In Safe Locker' | 'Claimed & Handed Over';
  claimedBy?: string;
  claimedAt?: string;
  notes?: string;
}

export type ArenaAtmosphere = 
  | 'Standard' 
  | 'Midnight LAN Rush' 
  | 'Tournament Finals' 
  | 'Happy Hour Rush';

export interface RigHardwareHealth {
  stationId: string;
  stationName: string;
  gpuTemp: number; // Celsius
  cpuTemp: number; // Celsius
  fanSpeedPercent: number;
  mouseClicks: number; // e.g. 840,000
  lastSanitizedAt: string;
  sanitizedBy: string;
  needsThermalPaste: boolean;
  controllerBatteryPercent?: number;
  notes?: string;
}

export type VisualTheme = 
  | 'enterprise-dark'
  | 'white-clean'
  | 'cyber-neon' 
  | 'stealth-gold' 
  | 'crimson-esports' 
  | 'nordic-frost';


