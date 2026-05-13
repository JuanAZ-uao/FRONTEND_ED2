import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../views/layouts/MainLayout';
import HomePage from '../views/pages/HomePage';
import EventDetailPage from '../views/pages/EventDetailPage';
import AuthPage from '../views/pages/AuthPage';
import CheckoutPage from '../views/pages/CheckoutPage';
import DashboardPage from '../views/pages/DashboardPage';
import ForgotPasswordPage from '../views/pages/ForgotPasswordPage';
import PaymentPage from '../views/pages/PaymentPage';
import ProfilePage from '../views/pages/ProfilePage';
import MobileHomePage from '../views/pages/MobileHomePage';

function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/event/:slug" element={<EventDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/mobile" element={<MobileHomePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route path="/auth" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
