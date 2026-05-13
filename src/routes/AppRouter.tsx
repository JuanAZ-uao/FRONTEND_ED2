import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../views/layouts/MainLayout';
import HomePage from '../views/pages/HomePage';
import EventDetailPage from '../views/pages/EventDetailPage';
import AuthPage from '../views/pages/AuthPage';
import QueuePage from '../views/pages/QueuePage';
import CheckoutPage from '../views/pages/CheckoutPage';
import TicketsPage from '../views/pages/TicketsPage';
import ForgotPasswordPage from '../views/pages/ForgotPasswordPage';
import PaymentPage from '../views/pages/PaymentPage';
import ProfilePage from '../views/pages/ProfilePage';
import TicketVerifyPage from '../views/pages/TicketVerifyPage';

function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/event/:id" element={<EventDetailPage />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route path="/verify/:code" element={<TicketVerifyPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={<Navigate to="/tickets" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
