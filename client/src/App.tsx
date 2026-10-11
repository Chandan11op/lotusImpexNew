import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { PublicLayout } from './layouts/PublicLayout';
import { CrmLayout } from './layouts/CrmLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { CataloguePage } from './pages/public/CataloguePage';
import { ProductDetailPage } from './pages/public/ProductDetailPage';
import { AboutPage } from './pages/public/AboutPage';
import { IndustriesPage } from './pages/public/IndustriesPage';
import { QualityPage } from './pages/public/QualityPage';
import { ContactPage } from './pages/public/ContactPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Auth & CRM Pages
import { LoginPage } from './pages/auth/LoginPage';
import { CrmOverviewPage } from './pages/crm/CrmOverviewPage';
import { EnquiriesPage } from './pages/crm/EnquiriesPage';
import { CustomersPage } from './pages/crm/CustomersPage';
import { ProductsPage } from './pages/crm/ProductsPage';
import { FollowUpsPage } from './pages/crm/FollowUpsPage';
import { ReportsPage } from './pages/crm/ReportsPage';
import { UsersPage } from './pages/crm/UsersPage';
import { SettingsPage } from './pages/crm/SettingsPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<CataloguePage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/industries" element={<IndustriesPage />} />
            <Route path="/quality" element={<QualityPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* CRM Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<Navigate to="/crm" replace />} />

          {/* Protected CRM Dashboard Routes */}
          <Route path="/crm" element={<CrmLayout />}>
            <Route index element={<CrmOverviewPage />} />
            <Route path="enquiries" element={<EnquiriesPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="follow-ups" element={<FollowUpsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
