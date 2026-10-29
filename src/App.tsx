import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';

// Core Gaming Pages
import { DashboardPage } from './pages/DashboardPage';
import { BranchesPage } from './pages/BranchesPage';
import { StationsPage } from './pages/StationsPage';
import { LiveSessionsPage } from './pages/LiveSessionsPage';
import { BookingsPage } from './pages/BookingsPage';
import { CustomersPage } from './pages/CustomersPage';
import { BillingPage } from './pages/BillingPage';
import { PricingPage } from './pages/PricingPage';
import { ReportsPage } from './pages/ReportsPage';
import { StaffPage } from './pages/StaffPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { TournamentsPage } from './pages/TournamentsPage';
import { ShiftRegisterPage } from './pages/ShiftRegisterPage';

// Food & Beverages (F&B) Pages
import { FnbDashboardPage } from './pages/fnb/FnbDashboardPage';
import { PosPage } from './pages/fnb/PosPage';
import { MenuManagementPage } from './pages/fnb/MenuManagementPage';
import { FnbCategoriesPage } from './pages/fnb/FnbCategoriesPage';
import { OrdersPage } from './pages/fnb/OrdersPage';
import { KitchenDisplayPage } from './pages/fnb/KitchenDisplayPage';
import { InventoryPage } from './pages/fnb/InventoryPage';
import { FnbReportsPage } from './pages/fnb/FnbReportsPage';

// Gamer / Customer Portal Pages
import { UserLayout } from './components/user/UserLayout';
import { UserDashboardPage } from './pages/user/UserDashboardPage';
import { UserStationsPage } from './pages/user/UserStationsPage';
import { UserGamesPage } from './pages/user/UserGamesPage';
import { UserLiveSessionPage } from './pages/user/UserLiveSessionPage';
import { UserCafePage } from './pages/user/UserCafePage';
import { UserTournamentsPage } from './pages/user/UserTournamentsPage';
import { UserWalletPage } from './pages/user/UserWalletPage';
import { UserProfilePage } from './pages/user/UserProfilePage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Gamer Portal (Customer View) */}
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<UserDashboardPage />} />
            <Route path="stations" element={<UserStationsPage />} />
            <Route path="games" element={<UserGamesPage />} />
            <Route path="session" element={<UserLiveSessionPage />} />
            <Route path="cafe" element={<UserCafePage />} />
            <Route path="tournaments" element={<UserTournamentsPage />} />
            <Route path="wallet" element={<UserWalletPage />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="*" element={<Navigate to="/user" replace />} />
          </Route>

          {/* Admin & Operations Portal (Staff View) */}
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="branches" element={<BranchesPage />} />
            <Route path="stations" element={<StationsPage />} />
            <Route path="sessions" element={<LiveSessionsPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="tournaments" element={<TournamentsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="shift-register" element={<ShiftRegisterPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />

            {/* Food & Beverages Subroutes */}
            <Route path="fnb" element={<FnbDashboardPage />} />
            <Route path="fnb/pos" element={<PosPage />} />
            <Route path="fnb/menu" element={<MenuManagementPage />} />
            <Route path="fnb/categories" element={<FnbCategoriesPage />} />
            <Route path="fnb/orders" element={<OrdersPage />} />
            <Route path="fnb/kitchen" element={<KitchenDisplayPage />} />
            <Route path="fnb/inventory" element={<InventoryPage />} />
            <Route path="fnb/reports" element={<FnbReportsPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
