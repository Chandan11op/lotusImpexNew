import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { PublicLayout } from './layouts/PublicLayout';
import { CrmLayout } from './layouts/CrmLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { CataloguePage } from './pages/public/CataloguePage';
import { CategoryPage } from './pages/public/CategoryPage';
import { ProductDetailPage } from './pages/public/ProductDetailPage';
import { AboutPage } from './pages/public/AboutPage';
import { IndustriesPage } from './pages/public/IndustriesPage';
import { IndustryDetailPage } from './pages/public/IndustryDetailPage';
import { QualityPage } from './pages/public/QualityPage';
import { SupplyProcessPage } from './pages/public/SupplyProcessPage';
import { MediaPage } from './pages/public/MediaPage';
import { RequestQuotePage } from './pages/public/RequestQuotePage';
import { SubmitBoqPage } from './pages/public/SubmitBoqPage';
import { ContactPage } from './pages/public/ContactPage';
import { FaqPage } from './pages/public/FaqPage';
import { PrivacyPage } from './pages/public/PrivacyPage';
import { TermsPage } from './pages/public/TermsPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Auth & CRM Pages
import { LoginPage } from './pages/auth/LoginPage';
import { CrmOverviewPage } from './pages/crm/CrmOverviewPage';
import { EnquiriesPage } from './pages/crm/EnquiriesPage';
import { QuotationsPage } from './pages/crm/QuotationsPage';
import { TasksPage } from './pages/crm/TasksPage';
import { CustomersPage } from './pages/crm/CustomersPage';
import { ProductsPage } from './pages/crm/ProductsPage';
import { FollowUpsPage } from './pages/crm/FollowUpsPage';
import { ReportsPage } from './pages/crm/ReportsPage';
import { UsersPage } from './pages/crm/UsersPage';
import { SettingsPage } from './pages/crm/SettingsPage';

import { ThemeProvider } from './context/ThemeContext';
import { LocaleProvider } from './context/LocaleContext';

// Helper dispatcher: allows both /products/:categorySlug and /products/:productSlug
const KNOWN_CATEGORIES = new Set([
  'sanitary-pipes',
  'electro-polished-pipes',
  'mechanically-polished-pipes',
  'sanitary-pipe-fittings',
  'tri-clamp-fittings',
  'clamps-and-ferrules',
  'gaskets',
  'sanitary-valves',
  'pneumatic-valves',
  'tank-cleaning-accessories',
]);

function ProductOrCategoryDispatcher() {
  const { slug } = useParams<{ slug: string }>();
  if (slug && KNOWN_CATEGORIES.has(slug)) {
    return <CategoryPage />;
  }
  return <ProductDetailPage />;
}

export function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Website Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<CataloguePage />} />
                <Route path="/products/:categorySlug/:productSlug" element={<ProductDetailPage />} />
                <Route path="/products/:slug" element={<ProductOrCategoryDispatcher />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/industries" element={<IndustriesPage />} />
                <Route path="/industries/:slug" element={<IndustryDetailPage />} />
                <Route path="/quality" element={<QualityPage />} />
                <Route path="/supply-process" element={<SupplyProcessPage />} />
                <Route path="/media" element={<MediaPage />} />
                <Route path="/request-quote" element={<RequestQuotePage />} />
                <Route path="/submit-boq" element={<SubmitBoqPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* CRM Authentication */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<Navigate to="/crm" replace />} />

              {/* Protected CRM Dashboard Routes */}
              <Route path="/crm" element={<CrmLayout />}>
                <Route index element={<CrmOverviewPage />} />
                <Route path="enquiries" element={<EnquiriesPage />} />
                <Route path="quotations" element={<QuotationsPage />} />
                <Route path="tasks" element={<TasksPage />} />
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
      </LocaleProvider>
    </ThemeProvider>
  );
}

export default App;
