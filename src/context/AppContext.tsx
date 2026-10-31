import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Branch,
  GamingStation,
  LiveSession,
  Booking,
  Customer,
  Invoice,
  InvoiceItem,
  PricingRule,
  StaffMember,
  StaffRole,
  NotificationItem,
  MenuItem,
  FnbOrder,
  StockItem,
  FnbOrderItem,
  ShiftStickyNote,
  LostAndFoundItem,
  ArenaAtmosphere,
  RigHardwareHealth,
  VisualTheme,
  LanChallenge,
  GamerGearConfig,
} from '../types';
import {
  initialBranches,
  initialStations,
  initialSessions,
  initialBookings,
  initialCustomers,
  initialInvoices,
  initialPricingRules,
  initialStaffMembers,
  initialNotifications,
  initialMenuItems,
  initialFnbOrders,
  initialStockItems,
  initialStickyNotes,
  initialLostAndFound,
  initialRigHealth,
  initialLanChallenges,
  initialGamerGearConfig,
} from '../services/mockData';
import { sound } from '../utils/audio';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface CartItem extends FnbOrderItem {
  imageUrl?: string;
}

interface AppContextType {
  // Branch & Staff Auth
  branches: Branch[];
  selectedBranchId: string; // 'ALL' or branch id
  setSelectedBranchId: (id: string) => void;
  selectedBranch?: Branch;
  activeRole: StaffRole;
  setActiveRole: (role: StaffRole) => void;
  currentUser: StaffMember;
  addBranch: (branch: Omit<Branch, 'id' | 'todayRevenue' | 'activeSessions'>) => void;
  updateBranch: (id: string, branch: Partial<Branch>) => void;

  // Stations
  stations: GamingStation[];
  filteredStations: GamingStation[];
  addStation: (station: Omit<GamingStation, 'id' | 'totalHoursUsed'>) => void;
  updateStation: (id: string, station: Partial<GamingStation>) => void;
  deleteStation: (id: string) => void;

  // Live Sessions
  sessions: LiveSession[];
  filteredSessions: LiveSession[];
  startSession: (data: {
    stationId: string;
    customerName: string;
    customerPhone?: string;
    durationHours: number;
    hourlyRate: number;
    paymentMethod?: 'UPI' | 'Card' | 'Cash';
    paidUpfront?: boolean;
    notes?: string;
  }) => void;
  extendSession: (sessionId: string, additionalMinutes: number) => void;
  endSession: (sessionId: string, paymentMethod?: 'UPI' | 'Card' | 'Cash') => void;

  // Bookings
  bookings: Booking[];
  filteredBookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => boolean;
  cancelBooking: (id: string, reason: string) => void;
  rescheduleBooking: (id: string, newDate: string, newStartTime: string, newEndTime: string) => void;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'totalBookings' | 'totalHoursPlayed' | 'totalSpending' | 'lastVisit'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;

  // Billing & Invoices
  invoices: Invoice[];
  filteredInvoices: Invoice[];
  recordPayment: (invoiceId: string, amount: number, method: 'UPI' | 'Card' | 'Cash' | 'NetBanking', txRef?: string) => void;
  processRefund: (invoiceId: string, reason: string) => void;

  // Pricing
  pricingRules: PricingRule[];
  updatePricingRule: (id: string, rule: Partial<PricingRule>) => void;

  // Staff
  staffMembers: StaffMember[];
  addStaff: (staff: Omit<StaffMember, 'id' | 'lastActive'>) => void;
  updateStaff: (id: string, staff: Partial<StaffMember>) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;

  // F&B Menu & POS
  menuItems: MenuItem[];
  filteredMenuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  toggleMenuItemAvailability: (id: string) => void;

  // F&B Orders
  fnbOrders: FnbOrder[];
  filteredFnbOrders: FnbOrder[];
  createFnbOrder: (order: Omit<FnbOrder, 'id' | 'orderNumber' | 'createdAt'>) => string;
  updateOrderStatus: (id: string, status: FnbOrder['orderStatus'], reason?: string) => void;

  // POS Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, variantName?: string, addons?: string[], specialInstructions?: string) => void;
  removeFromCart: (index: number) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;

  // Inventory
  stockItems: StockItem[];
  adjustStock: (id: string, quantityChange: number, reason: string) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Global search
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // Human Shift Sticky Notes
  stickyNotes: ShiftStickyNote[];
  addStickyNote: (note: Omit<ShiftStickyNote, 'id' | 'createdAt'>) => void;
  deleteStickyNote: (id: string) => void;
  togglePinStickyNote: (id: string) => void;

  // Lost & Found Locker
  lostAndFound: LostAndFoundItem[];
  addLostItem: (item: Omit<LostAndFoundItem, 'id' | 'foundAt'>) => void;
  claimLostItem: (id: string, claimedBy: string) => void;

  // Arena Atmosphere & Vibe
  arenaAtmosphere: ArenaAtmosphere;
  setArenaAtmosphere: (mode: ArenaAtmosphere) => void;

  // Sound FX
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;

  // Rig Hardware Watchdog
  rigHealth: RigHardwareHealth[];
  sanitizeStation: (stationId: string) => void;
  updateRigHealth: (stationId: string, health: Partial<RigHardwareHealth>) => void;

  // Quick Express Speed Seat
  speedSeat: (stationId: string, hours: number, paymentMethod: 'Cash' | 'UPI') => void;

  // Visual Theme Engine
  visualTheme: VisualTheme;
  setVisualTheme: (theme: VisualTheme) => void;

  // Gamer Portal State & Actions
  currentCustomer: Customer;
  currentCustomerId: string;
  setCurrentCustomerId: (id: string) => void;
  userActiveSession?: LiveSession;
  topUpUserWallet: (amount: number, bonusCredits?: number) => void;
  bookStationFromUser: (data: {
    stationId: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    durationHours: number;
    specialRequests?: string;
    payWithWallet?: boolean;
  }) => boolean;
  orderFnbFromUser: (data: {
    stationName: string;
    items: { menuItem: MenuItem; quantity: number }[];
    notes?: string;
    payWithWallet?: boolean;
  }) => boolean;
  requestDeskAssistance: (stationName: string, reason: string) => void;
  updateCurrentCustomerProfile: (data: Partial<Customer>) => void;

  // 1v1 LAN Battle Challenges
  lanChallenges: LanChallenge[];
  sendLanChallenge: (challenge: Omit<LanChallenge, 'id' | 'createdAt' | 'status'>) => void;
  respondLanChallenge: (id: string, accept: boolean) => void;
  completeLanChallenge: (id: string, winnerTag: string) => void;

  // Cafe PA Counter Voice Announcement
  broadcastCafePA: (message: string) => void;

  // Gamer Gear & Crosshair Cloud Sync
  gamerGearConfig: GamerGearConfig;
  updateGamerGearConfig: (config: Partial<GamerGearConfig>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Local storage helper
const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(`qhar_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const saveToStorage = <T,>(key: string, data: T): void => {
  try {
    localStorage.setItem(`qhar_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Storage save failed:', e);
  }
};

const refreshStaleSessions = (loaded: LiveSession[]): LiveSession[] => {
  const now = Date.now();
  return loaded.map((sess, idx) => {
    if (sess.status === 'Active' || sess.status === 'Overdue') {
      const end = new Date(sess.scheduledEndTime).getTime();
      if (now >= end) {
        const remainingMinutes = idx === 1 ? 25 : idx === 0 ? 55 : 80;
        return {
          ...sess,
          status: 'Active',
          startTime: new Date(now - 35 * 60 * 1000).toISOString(),
          scheduledEndTime: new Date(now + remainingMinutes * 60 * 1000).toISOString(),
        };
      }
    }
    return sess;
  });
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State initialization
  const [branches, setBranches] = useState<Branch[]>(() => loadFromStorage('branches', initialBranches));
  const [selectedBranchId, setSelectedBranchId] = useState<string>('ALL');
  const [activeRole, setActiveRole] = useState<StaffRole>('Super Admin');
  const [stations, setStations] = useState<GamingStation[]>(() => loadFromStorage('stations', initialStations));
  const [sessions, setSessions] = useState<LiveSession[]>(() => {
    const raw = loadFromStorage('sessions', initialSessions);
    return refreshStaleSessions(raw);
  });
  const [bookings, setBookings] = useState<Booking[]>(() => loadFromStorage('bookings', initialBookings));
  const [customers, setCustomers] = useState<Customer[]>(() => loadFromStorage('customers', initialCustomers));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadFromStorage('invoices', initialInvoices));
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(() => loadFromStorage('pricing', initialPricingRules));
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => loadFromStorage('staff', initialStaffMembers));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadFromStorage('notifications', initialNotifications));
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => loadFromStorage('menu', initialMenuItems));
  const [fnbOrders, setFnbOrders] = useState<FnbOrder[]>(() => loadFromStorage('fnb_orders', initialFnbOrders));
  const [stockItems, setStockItems] = useState<StockItem[]>(() => loadFromStorage('stock', initialStockItems));
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Human Features State
  const [stickyNotes, setStickyNotes] = useState<ShiftStickyNote[]>(() => loadFromStorage('sticky_notes', initialStickyNotes));
  const [lostAndFound, setLostAndFound] = useState<LostAndFoundItem[]>(() => loadFromStorage('lost_found', initialLostAndFound));
  const [arenaAtmosphere, setArenaAtmosphere] = useState<ArenaAtmosphere>(() => loadFromStorage('arena_vibe', 'Standard'));
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => loadFromStorage('sound_fx', true));
  // Rig Health & Themes
  const [rigHealth, setRigHealth] = useState<RigHardwareHealth[]>(() => loadFromStorage('rig_health', initialRigHealth));
  const [visualTheme, setVisualThemeState] = useState<VisualTheme>(() => {
    const saved = loadFromStorage<string>('visual_theme', 'enterprise-dark');
    return (saved as VisualTheme) || 'enterprise-dark';
  });

  // 1v1 LAN Challenges & Gamer Gear
  const [lanChallenges, setLanChallenges] = useState<LanChallenge[]>(() => loadFromStorage('lan_challenges', initialLanChallenges));
  const [gamerGearConfig, setGamerGearConfig] = useState<GamerGearConfig>(() => loadFromStorage('gamer_gear', initialGamerGearConfig));

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    sound.setEnabled(enabled);
    saveToStorage('sound_fx', enabled);
  };

  const applyThemeToDOM = (theme: VisualTheme) => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'white-clean') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  };

  const setVisualTheme = (theme: VisualTheme) => {
    setVisualThemeState(theme);
    saveToStorage('visual_theme', theme);
    applyThemeToDOM(theme);
  };

  // Sync data-theme attribute on mount / theme switch
  useEffect(() => {
    applyThemeToDOM(visualTheme);
  }, [visualTheme]);

  // Persist to storage on change
  useEffect(() => saveToStorage('branches', branches), [branches]);
  useEffect(() => saveToStorage('stations', stations), [stations]);
  useEffect(() => saveToStorage('sessions', sessions), [sessions]);
  useEffect(() => saveToStorage('bookings', bookings), [bookings]);
  useEffect(() => saveToStorage('customers', customers), [customers]);
  useEffect(() => saveToStorage('invoices', invoices), [invoices]);
  useEffect(() => saveToStorage('pricing', pricingRules), [pricingRules]);
  useEffect(() => saveToStorage('staff', staffMembers), [staffMembers]);
  useEffect(() => saveToStorage('notifications', notifications), [notifications]);
  useEffect(() => saveToStorage('menu', menuItems), [menuItems]);
  useEffect(() => saveToStorage('fnb_orders', fnbOrders), [fnbOrders]);
  useEffect(() => saveToStorage('stock', stockItems), [stockItems]);
  useEffect(() => saveToStorage('sticky_notes', stickyNotes), [stickyNotes]);
  useEffect(() => saveToStorage('lost_found', lostAndFound), [lostAndFound]);
  useEffect(() => saveToStorage('arena_vibe', arenaAtmosphere), [arenaAtmosphere]);
  useEffect(() => saveToStorage('rig_health', rigHealth), [rigHealth]);
  useEffect(() => saveToStorage('visual_theme', visualTheme), [visualTheme]);
  useEffect(() => saveToStorage('lan_challenges', lanChallenges), [lanChallenges]);
  useEffect(() => saveToStorage('gamer_gear', gamerGearConfig), [gamerGearConfig]);

  // Current logged in user based on selected role
  const currentUser: StaffMember = staffMembers.find((s) => s.role === activeRole) || staffMembers[0];
  const selectedBranch = selectedBranchId === 'ALL' ? undefined : branches.find((b) => b.id === selectedBranchId);

  // Toast Helpers
  const addToast = (title: string, message?: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Branch Filtered Data
  const matchesBranch = (branchId?: string) => {
    if (selectedBranchId === 'ALL') return true;
    return branchId === selectedBranchId;
  };

  const filteredStations = stations.filter((s) => matchesBranch(s.branchId));
  const filteredSessions = sessions.filter((s) => matchesBranch(s.branchId));
  const filteredBookings = bookings.filter((b) => matchesBranch(b.branchId));
  const filteredInvoices = invoices.filter((i) => matchesBranch(i.branchId));
  const filteredMenuItems = menuItems.filter((m) => !m.branchId || matchesBranch(m.branchId));
  const filteredFnbOrders = fnbOrders.filter((o) => matchesBranch(o.branchId));

  // Branch operations
  const addBranch = (data: Omit<Branch, 'id' | 'todayRevenue' | 'activeSessions'>) => {
    const newBranch: Branch = {
      ...data,
      id: `branch-${Date.now()}`,
      todayRevenue: 0,
      activeSessions: 0,
    };
    setBranches((prev) => [...prev, newBranch]);
    addToast('Branch Created', `${newBranch.name} was successfully registered.`, 'success');
  };

  const updateBranch = (id: string, data: Partial<Branch>) => {
    setBranches((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
    addToast('Branch Updated', 'Branch details have been refreshed.', 'success');
  };

  // Station operations
  const addStation = (data: Omit<GamingStation, 'id' | 'totalHoursUsed'>) => {
    const newStation: GamingStation = {
      ...data,
      id: `st-${Date.now().toString().slice(-4)}`,
      totalHoursUsed: 0,
    };
    setStations((prev) => [...prev, newStation]);
    addToast('Gaming Station Added', `${newStation.name} has been added to inventory.`, 'success');
  };

  const updateStation = (id: string, data: Partial<GamingStation>) => {
    setStations((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    addToast('Station Updated', 'Station configuration has been saved.', 'success');
  };

  const deleteStation = (id: string) => {
    const station = stations.find((s) => s.id === id);
    if (station?.status === 'In Use') {
      addToast('Cannot Delete', 'Cannot remove a station that currently has an active gaming session.', 'error');
      return;
    }
    setStations((prev) => prev.filter((s) => s.id !== id));
    addToast('Station Removed', 'Gaming station removed successfully.', 'info');
  };

  // Live Session operations
  const startSession = ({
    stationId,
    customerName,
    customerPhone,
    durationHours,
    hourlyRate,
    paymentMethod = 'UPI',
    paidUpfront = true,
    notes,
  }: {
    stationId: string;
    customerName: string;
    customerPhone?: string;
    durationHours: number;
    hourlyRate: number;
    paymentMethod?: 'UPI' | 'Card' | 'Cash';
    paidUpfront?: boolean;
    notes?: string;
  }) => {
    const station = stations.find((s) => s.id === stationId);
    if (!station) return;

    const startTime = new Date();
    const scheduledEndTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);
    const estimatedCharge = durationHours * hourlyRate;
    const sessionId = `sess-${Date.now().toString().slice(-4)}`;

    const newSession: LiveSession = {
      id: sessionId,
      stationId,
      stationName: station.name,
      stationType: station.type,
      branchId: station.branchId,
      customerId: `cust-${Date.now().toString().slice(-4)}`,
      customerName,
      customerPhone: customerPhone || '+91 98000 00000',
      startTime: startTime.toISOString(),
      scheduledEndTime: scheduledEndTime.toISOString(),
      hourlyRate,
      estimatedCharge,
      paymentStatus: paidUpfront ? 'Paid' : 'Pending',
      paymentMethod: paidUpfront ? paymentMethod : undefined,
      notes,
      status: 'Active',
      fnbOrderIds: [],
      totalFnbAmount: 0,
    };

    // Update station status to In Use
    setStations((prev) =>
      prev.map((s) =>
        s.id === stationId
          ? {
              ...s,
              status: 'In Use',
              currentSessionId: sessionId,
              currentCustomerName: customerName,
              sessionStartTime: startTime.toISOString(),
              scheduledEndTime: scheduledEndTime.toISOString(),
            }
          : s
      )
    );

    setSessions((prev) => [newSession, ...prev]);

    // Create Invoice if paid upfront
    if (paidUpfront) {
      const taxAmount = estimatedCharge * 0.18;
      const totalAmount = estimatedCharge + taxAmount;
      const invoice: Invoice = {
        id: `inv-${Date.now().toString().slice(-4)}`,
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        referenceType: 'Session',
        referenceId: sessionId,
        customerName,
        customerPhone,
        branchId: station.branchId,
        items: [
          {
            description: `${station.name} Gaming Session (${durationHours} hrs)`,
            type: 'Gaming',
            quantity: durationHours,
            rate: hourlyRate,
            amount: estimatedCharge,
          },
        ],
        subtotal: estimatedCharge,
        taxAmount,
        discountAmount: 0,
        totalAmount,
        amountPaid: totalAmount,
        outstandingAmount: 0,
        paymentMethod,
        paymentStatus: 'Paid',
        transactionRef: `${paymentMethod}-${Date.now().toString().slice(-8)}`,
        createdAt: new Date().toISOString(),
      };
      setInvoices((prev) => [invoice, ...prev]);
    }

    addToast('Gaming Session Started', `Station ${station.name} is now live for ${customerName}.`, 'success');
  };

  const extendSession = (sessionId: string, additionalMinutes: number) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    const currentEnd = new Date(session.scheduledEndTime).getTime();
    const newEndTime = new Date(currentEnd + additionalMinutes * 60 * 1000).toISOString();
    const addedHours = additionalMinutes / 60;
    const additionalCost = Math.round(addedHours * session.hourlyRate);

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              scheduledEndTime: newEndTime,
              estimatedCharge: s.estimatedCharge + additionalCost,
              status: 'Active',
            }
          : s
      )
    );

    setStations((prev) =>
      prev.map((st) => (st.id === session.stationId ? { ...st, scheduledEndTime: newEndTime } : st))
    );

    addToast('Session Extended', `Added ${additionalMinutes} minutes to ${session.stationName}. (+₹${additionalCost})`, 'info');
  };

  const endSession = (sessionId: string, paymentMethod: 'UPI' | 'Card' | 'Cash' = 'UPI') => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    const endTime = new Date();
    const startTime = new Date(session.startTime);
    const durationHours = Math.max(0.5, Math.round(((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)) * 10) / 10);
    const finalGamingCharge = Math.round(durationHours * session.hourlyRate);
    const totalFnb = session.totalFnbAmount || 0;
    const subtotal = finalGamingCharge + totalFnb;
    const taxAmount = Math.round(finalGamingCharge * 0.18 + totalFnb * 0.05);
    const grandTotal = subtotal + taxAmount;

    // Free up station
    setStations((prev) =>
      prev.map((s) =>
        s.id === session.stationId
          ? {
              ...s,
              status: 'Available',
              currentSessionId: undefined,
              currentCustomerName: undefined,
              currentCustomerId: undefined,
              sessionStartTime: undefined,
              scheduledEndTime: undefined,
              totalHoursUsed: (s.totalHoursUsed || 0) + durationHours,
            }
          : s
      )
    );

    // Update session status
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              status: 'Completed',
              actualEndTime: endTime.toISOString(),
              estimatedCharge: finalGamingCharge,
              paymentStatus: 'Paid',
              paymentMethod,
            }
          : s
      )
    );

    // Generate Final Settlement Invoice
    const invoiceItems: InvoiceItem[] = [
      {
        description: `${session.stationName} (${durationHours}h played)`,
        type: 'Gaming' as const,
        quantity: durationHours,
        rate: session.hourlyRate,
        amount: finalGamingCharge,
      },
    ];

    if (totalFnb > 0) {
      invoiceItems.push({
        description: `Food & Beverages Order Total (Linked to Session)`,
        type: 'F&B' as const,
        quantity: 1,
        rate: totalFnb,
        amount: totalFnb,
      });
    }

    const finalInvoice: Invoice = {
      id: `inv-${Date.now().toString().slice(-4)}`,
      invoiceNumber: `INV-${endTime.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      referenceType: totalFnb > 0 ? 'Combined' : 'Session',
      referenceId: sessionId,
      customerName: session.customerName,
      customerPhone: session.customerPhone,
      branchId: session.branchId,
      items: invoiceItems,
      subtotal,
      taxAmount,
      discountAmount: 0,
      totalAmount: grandTotal,
      amountPaid: grandTotal,
      outstandingAmount: 0,
      paymentMethod,
      paymentStatus: 'Paid',
      transactionRef: `SETTLE-${paymentMethod}-${Date.now().toString().slice(-6)}`,
      createdAt: endTime.toISOString(),
    };

    setInvoices((prev) => [finalInvoice, ...prev]);

    addToast('Session Ended & Settled', `Station ${session.stationName} is now Available. Invoice ${finalInvoice.invoiceNumber} generated.`, 'success');
  };

  // Booking operations
  const addBooking = (data: Omit<Booking, 'id' | 'createdAt'>): boolean => {
    // Conflict detection: Check if station is already booked on same date & overlapping time
    const conflict = bookings.find(
      (b) =>
        b.stationId === data.stationId &&
        b.bookingDate === data.bookingDate &&
        b.status !== 'Cancelled' &&
        !(data.endTime <= b.startTime || data.startTime >= b.endTime)
    );

    if (conflict) {
      addToast(
        'Booking Slot Conflict',
        `This station is already reserved from ${conflict.startTime} to ${conflict.endTime}.`,
        'error'
      );
      return false;
    }

    const newBooking: Booking = {
      ...data,
      id: `bk-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Generate Booking Invoice
    const invoice: Invoice = {
      id: `inv-${Date.now().toString().slice(-4)}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      referenceType: 'Booking',
      referenceId: newBooking.id,
      customerName: newBooking.customerName,
      customerPhone: newBooking.customerPhone,
      branchId: newBooking.branchId,
      items: [
        {
          description: `Advance Reservation: ${newBooking.stationName} (${newBooking.durationHours} hrs)`,
          type: 'Gaming',
          quantity: newBooking.durationHours,
          rate: Math.round(newBooking.totalAmount / newBooking.durationHours),
          amount: newBooking.totalAmount,
        },
      ],
      subtotal: newBooking.totalAmount,
      taxAmount: Math.round(newBooking.totalAmount * 0.18),
      discountAmount: 0,
      totalAmount: Math.round(newBooking.totalAmount * 1.18),
      amountPaid: newBooking.paymentStatus === 'Paid' ? Math.round(newBooking.totalAmount * 1.18) : 0,
      outstandingAmount: newBooking.paymentStatus === 'Paid' ? 0 : Math.round(newBooking.totalAmount * 1.18),
      paymentMethod: 'UPI',
      paymentStatus: newBooking.paymentStatus === 'Paid' ? 'Paid' : 'Pending',
      createdAt: new Date().toISOString(),
    };

    setInvoices((prev) => [invoice, ...prev]);
    addToast('Booking Confirmed', `Reserved ${newBooking.stationName} for ${newBooking.customerName}.`, 'success');
    return true;
  };

  const cancelBooking = (id: string, reason: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'Cancelled', cancellationReason: reason } : b))
    );
    addToast('Booking Cancelled', `Booking #${id} has been marked as cancelled.`, 'warning');
  };

  const rescheduleBooking = (id: string, newDate: string, newStartTime: string, newEndTime: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              bookingDate: newDate,
              startTime: newStartTime,
              endTime: newEndTime,
              status: 'Confirmed',
            }
          : b
      )
    );
    addToast('Booking Rescheduled', `New slot: ${newDate} (${newStartTime} - ${newEndTime})`, 'success');
  };

  // Customer operations
  const addCustomer = (data: Omit<Customer, 'id' | 'totalBookings' | 'totalHoursPlayed' | 'totalSpending' | 'lastVisit'>) => {
    const newCust: Customer = {
      ...data,
      id: `cust-${Date.now().toString().slice(-4)}`,
      totalBookings: 0,
      totalHoursPlayed: 0,
      totalSpending: 0,
      lastVisit: new Date().toISOString().slice(0, 10),
    };
    setCustomers((prev) => [newCust, ...prev]);
    addToast('Customer Created', `${newCust.name} has been enrolled into the system.`, 'success');
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    addToast('Customer Updated', 'Profile changes have been recorded.', 'success');
  };

  // Billing operations
  const recordPayment = (
    invoiceId: string,
    amount: number,
    method: 'UPI' | 'Card' | 'Cash' | 'NetBanking',
    txRef?: string
  ) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const newPaid = inv.amountPaid + amount;
        const remaining = Math.max(0, inv.totalAmount - newPaid);
        return {
          ...inv,
          amountPaid: newPaid,
          outstandingAmount: remaining,
          paymentStatus: remaining === 0 ? 'Paid' : 'Partially Paid',
          paymentMethod: method,
          transactionRef: txRef || `${method}-${Date.now().toString().slice(-6)}`,
        };
      })
    );
    addToast('Payment Recorded', `Received ₹${amount} via ${method}.`, 'success');
  };

  const processRefund = (invoiceId: string, reason: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              paymentStatus: 'Refunded',
              refundReason: reason,
              outstandingAmount: 0,
            }
          : inv
      )
    );
    addToast('Refund Processed', `Invoice marked as Refunded (${reason}).`, 'warning');
  };

  // Pricing Rule operations
  const updatePricingRule = (id: string, data: Partial<PricingRule>) => {
    setPricingRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
    addToast('Pricing Rule Updated', 'Base and weekend rates saved.', 'success');
  };

  // Staff operations
  const addStaff = (data: Omit<StaffMember, 'id' | 'lastActive'>) => {
    const newStaff: StaffMember = {
      ...data,
      id: `staff-${Date.now().toString().slice(-4)}`,
      lastActive: 'Just now',
    };
    setStaffMembers((prev) => [...prev, newStaff]);
    addToast('Staff Member Added', `${newStaff.name} assigned as ${newStaff.role}.`, 'success');
  };

  const updateStaff = (id: string, data: Partial<StaffMember>) => {
    setStaffMembers((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    addToast('Staff Permissions Updated', 'Staff role or status adjusted.', 'success');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('Notifications Cleared', 'All alerts marked as read.', 'info');
  };

  const clearNotifications = () => {
    setNotifications([]);
    addToast('All Notifications Removed', '', 'info');
  };

  // F&B Menu operations
  const addMenuItem = (data: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...data,
      id: `item-${Date.now().toString().slice(-4)}`,
    };
    setMenuItems((prev) => [newItem, ...prev]);
    addToast('Menu Item Created', `${newItem.name} is now visible on the menu.`, 'success');
  };

  const updateMenuItem = (id: string, data: Partial<MenuItem>) => {
    setMenuItems((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
    addToast('Menu Item Updated', 'Changes saved successfully.', 'success');
  };

  const toggleMenuItemAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const newStatus = m.availability === 'Available' ? 'Out of Stock' : 'Available';
        addToast('Availability Toggled', `${m.name} is now ${newStatus}.`, 'info');
        return { ...m, availability: newStatus };
      })
    );
  };

  // F&B Orders
  const createFnbOrder = (data: Omit<FnbOrder, 'id' | 'orderNumber' | 'createdAt'>): string => {
    const orderNumber = `Q-ORD-${Math.floor(2100 + Math.random() * 8000)}`;
    const newOrder: FnbOrder = {
      ...data,
      id: `fnb-${Date.now().toString().slice(-4)}`,
      orderNumber,
      createdAt: new Date().toISOString(),
    };

    setFnbOrders((prev) => [newOrder, ...prev]);

    // If order is linked to active gaming session
    if (newOrder.sessionId) {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== newOrder.sessionId) return s;
          const currentOrders = s.fnbOrderIds || [];
          return {
            ...s,
            fnbOrderIds: [...currentOrders, newOrder.id],
            totalFnbAmount: (s.totalFnbAmount || 0) + newOrder.total,
          };
        })
      );
    }

    // Deduct stock for ordered items
    newOrder.items.forEach((ordered) => {
      setStockItems((prev) =>
        prev.map((stk) => {
          if (stk.sku === ordered.menuItemId || stk.name.includes(ordered.name)) {
            const updatedStock = Math.max(0, stk.currentStock - ordered.quantity);
            return {
              ...stk,
              currentStock: updatedStock,
              status: updatedStock === 0 ? 'Out of Stock' : updatedStock <= stk.minThreshold ? 'Low Stock' : 'In Stock',
            };
          }
          return stk;
        })
      );
    });

    addToast('F&B Order Placed', `Order ${orderNumber} queued for kitchen preparation.`, 'success');
    return newOrder.id;
  };

  const updateOrderStatus = (id: string, status: FnbOrder['orderStatus'], reason?: string) => {
    const nowTime = new Date().toISOString();
    setFnbOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        return {
          ...o,
          orderStatus: status,
          cancellationReason: reason || o.cancellationReason,
          acceptedAt: status === 'Accepted' ? nowTime : o.acceptedAt,
          preparedAt: status === 'Ready' ? nowTime : o.preparedAt,
          deliveredAt: status === 'Served / Delivered' ? nowTime : o.deliveredAt,
        };
      })
    );
    addToast('Order Status Updated', `Order #${id} marked as ${status}.`, 'info');
  };

  // POS Cart operations
  const addToCart = (
    item: MenuItem,
    variantName?: string,
    addons: string[] = [],
    specialInstructions?: string
  ) => {
    let unitPrice = item.sellingPrice;
    if (variantName && item.variants) {
      const v = item.variants.find((vr) => vr.name === variantName);
      if (v) unitPrice += v.priceDelta;
    }
    if (addons.length && item.addons) {
      addons.forEach((addonId) => {
        const ad = item.addons?.find((a) => a.id === addonId);
        if (ad) unitPrice += ad.price;
      });
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (ci) =>
          ci.menuItemId === item.id &&
          ci.selectedVariant === variantName &&
          JSON.stringify(ci.selectedAddons) === JSON.stringify(addons)
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + 1;
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          totalPrice: newQty * existing.unitPrice,
        };
        return updated;
      }

      return [
        ...prev,
        {
          menuItemId: item.id,
          name: item.name,
          unitPrice,
          quantity: 1,
          selectedVariant: variantName,
          selectedAddons: addons,
          totalPrice: unitPrice,
          specialInstructions,
          imageUrl: item.imageUrl,
        },
      ];
    });

    addToast('Item Added to Cart', `${item.name} added.`, 'success');
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      const item = updated[index];
      updated[index] = {
        ...item,
        quantity,
        totalPrice: quantity * item.unitPrice,
      };
      return updated;
    });
  };

  const clearCart = () => setCart([]);

  // Stock operations
  const adjustStock = (id: string, quantityChange: number, reason: string) => {
    setStockItems((prev) =>
      prev.map((stk) => {
        if (stk.id !== id) return stk;
        const newStock = Math.max(0, stk.currentStock + quantityChange);
        const newStatus =
          newStock === 0 ? 'Out of Stock' : newStock <= stk.minThreshold ? 'Low Stock' : 'In Stock';
        return {
          ...stk,
          currentStock: newStock,
          status: newStatus,
        };
      })
    );
    addToast('Inventory Stock Adjusted', `Reason: ${reason}`, 'info');
  };

  // Shift Sticky Notes Actions
  const addStickyNote = (note: Omit<ShiftStickyNote, 'id' | 'createdAt'>) => {
    const newNote: ShiftStickyNote = {
      ...note,
      id: `note-${Date.now()}`,
      createdAt: 'Just now',
    };
    setStickyNotes((prev) => [newNote, ...prev]);
    sound.playClick();
    addToast('Note Pinned', `"${note.title}" added to shift board`, 'success');
  };

  const deleteStickyNote = (id: string) => {
    setStickyNotes((prev) => prev.filter((n) => n.id !== id));
    sound.playClick();
    addToast('Note Removed', 'Sticky note removed from board', 'info');
  };

  const togglePinStickyNote = (id: string) => {
    setStickyNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
    sound.playClick();
  };

  // Lost & Found Desk
  const addLostItem = (item: Omit<LostAndFoundItem, 'id' | 'foundAt'>) => {
    const newItem: LostAndFoundItem = {
      ...item,
      id: `lost-${Date.now()}`,
      foundAt: 'Just now',
    };
    setLostAndFound((prev) => [newItem, ...prev]);
    sound.playClick();
    addToast('Lost Item Logged', `Logged in Locker: ${item.itemName}`, 'info');
  };

  const claimLostItem = (id: string, claimedBy: string) => {
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setLostAndFound((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Claimed & Handed Over',
              claimedBy,
              claimedAt: `Today, ${nowTime}`,
            }
          : item
      )
    );
    sound.playClick();
    addToast('Item Claimed', `Handed over to ${claimedBy}`, 'success');
  };

  // Rig Hardware Telemetry
  const sanitizeStation = (stationId: string) => {
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setRigHealth((prev) => {
      const existing = prev.find((r) => r.stationId === stationId);
      if (existing) {
        return prev.map((r) =>
          r.stationId === stationId
            ? { ...r, lastSanitizedAt: `Today, ${nowTime}`, sanitizedBy: currentUser.name }
            : r
        );
      }
      const st = stations.find((s) => s.id === stationId);
      return [
        ...prev,
        {
          stationId,
          stationName: st ? st.name : stationId,
          gpuTemp: 60,
          cpuTemp: 55,
          fanSpeedPercent: 60,
          mouseClicks: 250000,
          lastSanitizedAt: `Today, ${nowTime}`,
          sanitizedBy: currentUser.name,
          needsThermalPaste: false,
        },
      ];
    });
    sound.playClick();
    addToast('Rig Sanitized & Ready', `Station wiped & disinfected by ${currentUser.name}`, 'success');
  };

  const updateRigHealth = (stationId: string, health: Partial<RigHardwareHealth>) => {
    setRigHealth((prev) =>
      prev.map((r) => (r.stationId === stationId ? { ...r, ...health } : r))
    );
  };

  // Quick Express Speed-Seat (1-Click Walk-In Launcher)
  const speedSeat = (stationId: string, hours: number, paymentMethod: 'Cash' | 'UPI') => {
    const station = stations.find((s) => s.id === stationId);
    if (!station) return;
    const rate = station.hourlyRate;
    startSession({
      stationId,
      customerName: `Express Gamer #${Math.floor(1000 + Math.random() * 9000)}`,
      customerPhone: '+91 98000 00000',
      durationHours: hours,
      hourlyRate: rate,
      paymentMethod,
      paidUpfront: true,
      notes: `⚡ Speed-Seat Instant Play (${hours} hr)`,
    });
    sound.playCashRegister();
    addToast('⚡ Express Speed-Seat Activated!', `${station.name} started for ${hours}h (${paymentMethod})`, 'success');
  };

  // ----------------- Gamer Portal Core Implementation ----------------- //
  const [currentCustomerId, setCurrentCustomerIdState] = useState<string>(
    () => loadFromStorage('current_gamer_id', 'cust-1')
  );

  const setCurrentCustomerId = (id: string) => {
    setCurrentCustomerIdState(id);
    saveToStorage('current_gamer_id', id);
    const found = customers.find((c) => c.id === id);
    if (found) {
      addToast('Gamer Profile Switched', `Logged in as ${found.gamerTag || found.name}`, 'info');
    }
  };

  const currentCustomer: Customer =
    customers.find((c) => c.id === currentCustomerId) || customers[0] || initialCustomers[0];

  const userActiveSession = sessions.find(
    (s) =>
      (s.customerId === currentCustomer.id ||
        s.customerName.toLowerCase() === currentCustomer.name.toLowerCase() ||
        (currentCustomer.gamerTag && s.customerName.toLowerCase() === currentCustomer.gamerTag.toLowerCase())) &&
      (s.status === 'Active' || s.status === 'Overdue')
  );

  const topUpUserWallet = (amount: number, bonusCredits = 0) => {
    const totalCredit = amount + bonusCredits;
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === currentCustomer.id
          ? {
              ...c,
              walletBalance: (c.walletBalance || 0) + totalCredit,
              loyaltyXP: (c.loyaltyXP || 0) + Math.round(amount * 0.1),
            }
          : c
      )
    );

    // Record invoice receipt for transaction history
    const inv: Invoice = {
      id: `inv-${Date.now().toString().slice(-4)}`,
      invoiceNumber: `WAL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      referenceType: 'POS_FNB',
      referenceId: currentCustomer.id,
      customerName: currentCustomer.name,
      customerPhone: currentCustomer.phone,
      branchId: selectedBranchId !== 'ALL' ? selectedBranchId : 'branch-1',
      items: [
        {
          description: `Gamer Wallet Recharge (₹${amount}${bonusCredits > 0 ? ` + ₹${bonusCredits} Bonus` : ''})`,
          type: 'Extra',
          quantity: 1,
          rate: amount,
          amount: amount,
        },
      ],
      subtotal: amount,
      taxAmount: 0,
      discountAmount: bonusCredits,
      totalAmount: amount,
      amountPaid: amount,
      outstandingAmount: 0,
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      transactionRef: `UPI-WAL-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    };
    setInvoices((prev) => [inv, ...prev]);
    sound.playCashRegister();
    addToast(
      'Wallet Recharged!',
      `Added ₹${totalCredit} to ${currentCustomer.gamerTag || currentCustomer.name}'s balance.`,
      'success'
    );
  };

  const bookStationFromUser = (data: {
    stationId: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    durationHours: number;
    specialRequests?: string;
    payWithWallet?: boolean;
  }): boolean => {
    const station = stations.find((s) => s.id === data.stationId);
    if (!station) {
      addToast('Station not found', 'Please choose a valid station', 'error');
      return false;
    }

    const hourlyRate = station.hourlyRate;
    const baseAmount = hourlyRate * data.durationHours;
    const discount = currentCustomer.status === 'VIP' ? Math.round(baseAmount * 0.1) : 0;
    const tax = Math.round((baseAmount - discount) * 0.18);
    const grandTotal = baseAmount - discount + tax;

    if (data.payWithWallet) {
      if ((currentCustomer.walletBalance || 0) < grandTotal) {
        addToast(
          'Insufficient Wallet Balance',
          `Required: ₹${grandTotal}, Current: ₹${currentCustomer.walletBalance || 0}. Please recharge first or pay at counter.`,
          'error'
        );
        return false;
      }

      // Deduct from wallet
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === currentCustomer.id
            ? {
                ...c,
                walletBalance: Math.max(0, (c.walletBalance || 0) - grandTotal),
                totalBookings: (c.totalBookings || 0) + 1,
                totalSpending: (c.totalSpending || 0) + grandTotal,
                loyaltyXP: (c.loyaltyXP || 0) + 50,
              }
            : c
        )
      );
    }

    const success = addBooking({
      customerName: currentCustomer.name,
      customerEmail: currentCustomer.email,
      customerPhone: currentCustomer.phone,
      branchId: station.branchId,
      stationId: station.id,
      stationName: station.name,
      stationType: station.type,
      bookingDate: data.bookingDate,
      startTime: data.startTime,
      endTime: data.endTime,
      durationHours: data.durationHours,
      status: 'Confirmed',
      paymentStatus: data.payWithWallet ? 'Paid' : 'Pending',
      totalAmount: grandTotal,
      specialRequests: data.specialRequests
        ? `${data.specialRequests} [GamerTag: ${currentCustomer.gamerTag || 'Player'}]`
        : `[GamerTag: ${currentCustomer.gamerTag || 'Player'}]`,
    });

    if (success) {
      sound.playSessionStart();
    }
    return success;
  };

  const orderFnbFromUser = (data: {
    stationName: string;
    items: { menuItem: MenuItem; quantity: number }[];
    notes?: string;
    payWithWallet?: boolean;
  }): boolean => {
    if (!data.items.length) {
      addToast('Cart is empty', 'Add at least one item to order', 'warning');
      return false;
    }

    const subtotal = data.items.reduce(
      (sum, item) => sum + item.menuItem.sellingPrice * item.quantity,
      0
    );
    const tax = Math.round(subtotal * 0.05); // 5% GST
    const total = subtotal + tax;

    if (data.payWithWallet) {
      if ((currentCustomer.walletBalance || 0) < total) {
        addToast(
          'Insufficient Wallet Balance',
          `Required: ₹${total}, Current: ₹${currentCustomer.walletBalance || 0}. Please recharge first.`,
          'error'
        );
        return false;
      }
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === currentCustomer.id
            ? {
                ...c,
                walletBalance: Math.max(0, (c.walletBalance || 0) - total),
                totalSpending: (c.totalSpending || 0) + total,
                loyaltyXP: (c.loyaltyXP || 0) + 20,
              }
            : c
        )
      );
    }

    const orderItems: FnbOrderItem[] = data.items.map((item) => ({
      menuItemId: item.menuItem.id,
      name: item.menuItem.name,
      quantity: item.quantity,
      unitPrice: item.menuItem.sellingPrice,
      totalPrice: item.menuItem.sellingPrice * item.quantity,
    }));

    const targetBranch = userActiveSession
      ? userActiveSession.branchId
      : selectedBranchId !== 'ALL'
      ? selectedBranchId
      : 'branch-1';

    createFnbOrder({
      branchId: targetBranch,
      sessionId: userActiveSession ? userActiveSession.id : undefined,
      orderType: 'Station Delivery',
      stationId: userActiveSession ? userActiveSession.stationId : undefined,
      stationName: data.stationName || (userActiveSession ? userActiveSession.stationName : 'Desk Delivery'),
      customerName: currentCustomer.gamerTag
        ? `${currentCustomer.name} (${currentCustomer.gamerTag})`
        : currentCustomer.name,
      customerPhone: currentCustomer.phone,
      items: orderItems,
      subtotal,
      tax,
      discount: 0,
      total,
      orderStatus: 'New',
      paymentStatus: data.payWithWallet ? 'Paid' : 'Pending',
      paymentMethod: data.payWithWallet ? 'Wallet' : 'UPI',
      notes: data.notes,
    });

    sound.playCashRegister();
    addToast(
      'In-Seat Order Placed! 🍟',
      `Delivering to ${data.stationName || 'your station'}. Kitchen preparing now!`,
      'success'
    );
    return true;
  };

  const requestDeskAssistance = (stationName: string, reason: string) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `🚨 Desk Call: ${stationName}`,
      message: `${currentCustomer.gamerTag || currentCustomer.name} needs help at ${stationName}: "${reason}"`,
      type: 'alert',
      severity: 'warning',
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    sound.playAlert();
    addToast('Attendant Summoned!', `A staff runner has been dispatched to ${stationName}.`, 'success');
  };

  const updateCurrentCustomerProfile = (data: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === currentCustomer.id ? { ...c, ...data } : c))
    );
    addToast('Profile Updated', 'Your gamer credentials & preferences are saved.', 'success');
  };

  // 1v1 LAN Challenge Handlers
  const sendLanChallenge = (challenge: Omit<LanChallenge, 'id' | 'createdAt' | 'status'>) => {
    const newChallenge: LanChallenge = {
      ...challenge,
      id: `chal-${Date.now()}`,
      createdAt: 'Just now',
      status: 'Pending',
    };
    setLanChallenges((prev) => [newChallenge, ...prev]);
    sound.playBattleChallenge();
    addToast('1v1 Challenge Dispatched! ⚔️', `Sent match challenge to ${challenge.toGamerTag} on ${challenge.toStationName}!`, 'warning');
    sound.speakCafePA(`1v1 challenge sent from ${challenge.fromStationName} to ${challenge.toStationName} for ${challenge.gameTitle}!`);
  };

  const respondLanChallenge = (id: string, accept: boolean) => {
    setLanChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: accept ? 'Accepted' : 'Declined' } : c))
    );
    if (accept) {
      sound.playSessionStart();
      addToast('Challenge Accepted! 💥', 'Get ready! Match starting on both stations!', 'success');
      sound.speakCafePA('LAN grudge match accepted! Stations locked in for battle!');
    } else {
      addToast('Challenge Declined', 'Opponent stepped down.', 'info');
    }
  };

  const completeLanChallenge = (id: string, winnerTag: string) => {
    setLanChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Completed', winnerTag } : c))
    );
    sound.playCoin();
    addToast('Victory Confirmed! 🏆', `${winnerTag} won the 1v1 grudge match!`, 'success');
    sound.speakCafePA(`Victory! ${winnerTag} has won the 1v1 grudge match!`);
  };

  const broadcastCafePA = (message: string) => {
    sound.speakCafePA(message);
    addToast('Cafe PA Broadcast 📢', message, 'info');
  };

  const updateGamerGearConfig = (config: Partial<GamerGearConfig>) => {
    setGamerGearConfig((prev) => {
      const updated = { ...prev, ...config };
      saveToStorage('gamer_gear', updated);
      return updated;
    });
    sound.playClick();
    addToast('Gear Config Cloud Synced! ⚡', 'DPI & Crosshair profile saved for all cafe PCs.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        branches,
        selectedBranchId,
        setSelectedBranchId,
        selectedBranch,
        activeRole,
        setActiveRole,
        currentUser,
        addBranch,
        updateBranch,

        stations,
        filteredStations,
        addStation,
        updateStation,
        deleteStation,

        sessions,
        filteredSessions,
        startSession,
        extendSession,
        endSession,

        bookings,
        filteredBookings,
        addBooking,
        cancelBooking,
        rescheduleBooking,

        customers,
        addCustomer,
        updateCustomer,

        invoices,
        filteredInvoices,
        recordPayment,
        processRefund,

        pricingRules,
        updatePricingRule,

        staffMembers,
        addStaff,
        updateStaff,

        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,

        menuItems,
        filteredMenuItems,
        addMenuItem,
        updateMenuItem,
        toggleMenuItemAvailability,

        fnbOrders,
        filteredFnbOrders,
        createFnbOrder,
        updateOrderStatus,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,

        stockItems,
        adjustStock,

        toasts,
        addToast,
        removeToast,

        globalSearch,
        setGlobalSearch,

        stickyNotes,
        addStickyNote,
        deleteStickyNote,
        togglePinStickyNote,

        lostAndFound,
        addLostItem,
        claimLostItem,

        arenaAtmosphere,
        setArenaAtmosphere,

        soundEnabled,
        setSoundEnabled,

        rigHealth,
        sanitizeStation,
        updateRigHealth,

        speedSeat,

        visualTheme,
        setVisualTheme,

        // Gamer Portal State & Actions
        currentCustomer,
        currentCustomerId,
        setCurrentCustomerId,
        userActiveSession,
        topUpUserWallet,
        bookStationFromUser,
        orderFnbFromUser,
        requestDeskAssistance,
        updateCurrentCustomerProfile,

        // 1v1 LAN Challenges & Gear
        lanChallenges,
        sendLanChallenge,
        respondLanChallenge,
        completeLanChallenge,
        broadcastCafePA,
        gamerGearConfig,
        updateGamerGearConfig,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
