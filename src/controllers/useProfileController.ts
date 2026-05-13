import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthUser } from '../services/auth.service';
import { authService } from '../services/auth.service';
import { userService, type PaymentMethod, type NotifPrefs, type UserTicket } from '../services/user.service';

export type ProfileSection = 'perfil' | 'entradas' | 'pagos' | 'seguridad' | 'notificaciones';

type ProfileForm = {
  firstName: string; lastName: string; phone: string;
  birthDate: string; gender: string; city: string;
  document: string; bio: string; avatarUrl: string;
};

const toForm = (u: AuthUser): ProfileForm => ({
  firstName: u.firstName, lastName: u.lastName,
  phone: u.phone ?? '', birthDate: u.birthDate ? u.birthDate.slice(0, 10) : '',
  gender: u.gender ?? '', city: u.city ?? '',
  document: u.document ?? '', bio: u.bio ?? '', avatarUrl: u.avatarUrl ?? '',
});

const emptyCard = { number: '', brand: 'VISA', expiryMonth: '', expiryYear: '', isPrimary: false };

const detectBrand = (number: string): string => {
  const d = number.replace(/\D/g, '');
  if (d.startsWith('4')) return 'VISA';
  if (d.startsWith('5') || d.startsWith('2')) return 'MASTERCARD';
  if (d.startsWith('3')) return 'AMEX';
  return 'VISA';
};

export const useProfileController = () => {
  const navigate = useNavigate();
  const session = authService.getSession();

  const [activeSection, setActiveSection] = useState<ProfileSection>('perfil');

  // ── Personal data ──────────────────────────────────────────────
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [form, setForm] = useState<ProfileForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (!session) { setLoading(false); return; }
    setLoading(true);
    userService.getProfile()
      .then((d) => { setProfile(d); setForm(toForm(d)); })
      .catch((e: Error) => setLoadError(e.message ?? 'No se pudo cargar el perfil'))
      .finally(() => setLoading(false));
  }, []);

  const onChange = (field: keyof ProfileForm, value: string) =>
    setForm((p) => (p ? { ...p, [field]: value } : p));

  const save = async () => {
    if (!form || !session) return;
    try {
      setSaving(true); setFeedback('');
      const updated = await userService.updateProfile({
        firstName: form.firstName || undefined, lastName: form.lastName || undefined,
        phone: form.phone || null, birthDate: form.birthDate || null,
        gender: form.gender || null, city: form.city || null,
        document: form.document || null, bio: form.bio || null, avatarUrl: form.avatarUrl || null,
      });
      setProfile(updated); setForm(toForm(updated));
      authService.persistSession({ ...session, user: { ...session.user, ...updated } });
      setFeedbackType('success'); setFeedback('Perfil actualizado correctamente');
    } catch (e) {
      setFeedbackType('error');
      setFeedback(e instanceof Error ? e.message : 'Error al guardar');
    } finally { setSaving(false); }
  };

  // ── Tickets ────────────────────────────────────────────────────
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [qrTicket, setQrTicket] = useState<UserTicket | null>(null);
  const [ticketTab, setTicketTab] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    if (activeSection !== 'entradas' || !session || tickets.length > 0) return;
    setTicketsLoading(true);
    userService.getMyTickets()
      .then(setTickets)
      .catch(() => {})
      .finally(() => setTicketsLoading(false));
  }, [activeSection]);

  const filteredTickets = tickets.filter((t) => {
    const upcoming = new Date(t.ticketType.concert.date) >= new Date() && t.status !== 'CANCELLED';
    if (ticketTab === 'upcoming') return upcoming;
    if (ticketTab === 'past') return !upcoming;
    return true;
  });

  // ── Payment methods ────────────────────────────────────────────
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [pmLoading, setPmLoading] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState(emptyCard);
  const [pmFeedback, setPmFeedback] = useState('');
  const [pmFeedbackType, setPmFeedbackType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (activeSection !== 'pagos' || !session || paymentMethods.length > 0) return;
    setPmLoading(true);
    userService.getPaymentMethods()
      .then(setPaymentMethods)
      .catch(() => {})
      .finally(() => setPmLoading(false));
  }, [activeSection]);

  const onCardField = (field: keyof typeof emptyCard, value: string | boolean) =>
    setNewCard((p) => ({ ...p, [field]: value, ...(field === 'number' ? { brand: detectBrand(value as string) } : {}) }));

  const addCard = async () => {
    const digits = newCard.number.replace(/\D/g, '');
    if (digits.length < 13) { setPmFeedbackType('error'); setPmFeedback('Número de tarjeta inválido'); return; }
    const month = parseInt(newCard.expiryMonth, 10);
    const year = parseInt(newCard.expiryYear, 10);
    if (!month || month < 1 || month > 12 || !year) { setPmFeedbackType('error'); setPmFeedback('Fecha de vencimiento inválida'); return; }
    try {
      setPmLoading(true); setPmFeedback('');
      const created = await userService.addPaymentMethod({
        lastFour: digits.slice(-4), brand: newCard.brand,
        expiryMonth: month, expiryYear: year, isPrimary: newCard.isPrimary,
      });
      setPaymentMethods((p) => newCard.isPrimary ? [created, ...p.map((m) => ({ ...m, isPrimary: false }))] : [...p, created]);
      setShowAddCard(false); setNewCard(emptyCard);
      setPmFeedbackType('success'); setPmFeedback('Tarjeta agregada');
    } catch (e) {
      setPmFeedbackType('error'); setPmFeedback(e instanceof Error ? e.message : 'Error al agregar');
    } finally { setPmLoading(false); }
  };

  const removeCard = async (id: number) => {
    try {
      await userService.deletePaymentMethod(id);
      setPaymentMethods((p) => p.filter((m) => m.id !== id));
    } catch (e) {
      setPmFeedbackType('error'); setPmFeedback(e instanceof Error ? e.message : 'Error al eliminar');
    }
  };

  // ── Notifications ──────────────────────────────────────────────
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs | null>(null);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifFeedback, setNotifFeedback] = useState('');

  useEffect(() => {
    if (activeSection !== 'notificaciones' || !session || notifPrefs) return;
    setNotifLoading(true);
    userService.getNotifications()
      .then(setNotifPrefs)
      .catch(() => {})
      .finally(() => setNotifLoading(false));
  }, [activeSection]);

  const toggleNotif = (field: keyof NotifPrefs) =>
    setNotifPrefs((p) => p ? { ...p, [field]: !p[field as keyof NotifPrefs] } : p);

  const saveNotifs = async () => {
    if (!notifPrefs) return;
    try {
      setNotifSaving(true);
      const updated = await userService.updateNotifications(notifPrefs);
      setNotifPrefs(updated);
      setNotifFeedback('Preferencias guardadas');
      setTimeout(() => setNotifFeedback(''), 3000);
    } catch { setNotifFeedback('Error al guardar'); }
    finally { setNotifSaving(false); }
  };

  // ── Security ───────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwFeedback, setPwFeedback] = useState('');
  const [pwFeedbackType, setPwFeedbackType] = useState<'success' | 'error'>('success');

  const onPwField = (field: 'current' | 'newPw' | 'confirm', value: string) =>
    setPwForm((p) => ({ ...p, [field]: value }));

  const changePassword = async () => {
    if (pwForm.newPw !== pwForm.confirm) {
      setPwFeedbackType('error'); setPwFeedback('Las contraseñas nuevas no coinciden'); return;
    }
    try {
      setPwSaving(true); setPwFeedback('');
      const res = await userService.changePassword(pwForm.current, pwForm.newPw);
      setPwFeedbackType('success'); setPwFeedback(res.message);
      setPwForm({ current: '', newPw: '', confirm: '' });
    } catch (e) {
      setPwFeedbackType('error'); setPwFeedback(e instanceof Error ? e.message : 'Error al cambiar contraseña');
    } finally { setPwSaving(false); }
  };

  const logout = () => {
    authService.clearSession();
    navigate('/auth');
  };

  return {
    session, profile, form, loading, loadError, saving, feedback, feedbackType,
    onChange, save,
    activeSection, setActiveSection,
    tickets: filteredTickets, ticketsLoading, qrTicket, setQrTicket, ticketTab, setTicketTab,
    paymentMethods, pmLoading, showAddCard, setShowAddCard, newCard, onCardField, addCard, removeCard,
    pmFeedback, pmFeedbackType,
    notifPrefs, notifLoading, notifSaving, notifFeedback, toggleNotif, saveNotifs,
    pwForm, pwSaving, pwFeedback, pwFeedbackType, onPwField, changePassword,
    logout,
  };
};
