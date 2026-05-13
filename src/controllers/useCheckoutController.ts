import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { PaymentCard } from '../models/payment.model';
import { authService } from '../services/auth.service';
import { eventService } from '../services/event.service';
import { paymentService } from '../services/payment.service';
import { reservationService } from '../services/reservation.service';

const emptyCard: PaymentCard = {
  holderName: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
};

const sanitizeHolderName = (value: string) =>
  value
    .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/^\s+/, '')
    .slice(0, 60);

const sanitizeCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};

const sanitizeExpiry = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length === 0) return '';
  if (digits.length < 2) return digits;
  if (digits.length === 2) return `${digits}/`;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const sanitizeCvc = (value: string) => value.replace(/\D/g, '').slice(0, 3);

export const useCheckoutController = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const eventSlug = searchParams.get('event');
  const requestedTier = searchParams.get('tier');

  const event = useMemo(() => {
    if (!eventSlug) return null;
    return eventService.getEventBySlug(eventSlug) ?? null;
  }, [eventSlug]);

  const [selectedTierId, setSelectedTierId] = useState<string>(requestedTier ?? '');
  const [quantity, setQuantity] = useState(1);
  const [card, setCard] = useState<PaymentCard>(emptyCard);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState<'error' | 'success' | 'info'>('info');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!event) {
      setSelectedTierId('');
      return;
    }

    const hasRequestedTier =
      !!requestedTier && event.ticketTiers.some((tier) => tier.id === requestedTier);

    setSelectedTierId(hasRequestedTier ? (requestedTier as string) : event.ticketTiers[0]?.id ?? '');
    setQuantity(1);
  }, [event, requestedTier]);

  const selectedTier = useMemo(() => {
    if (!event) return null;
    return event.ticketTiers.find((tier) => tier.id === selectedTierId) ?? event.ticketTiers[0] ?? null;
  }, [event, selectedTierId]);

  const subtotal = selectedTier ? selectedTier.price * quantity : 0;
  const summary = paymentService.calculateSummary(subtotal);

  const updateCardField = (field: keyof PaymentCard, value: string) => {
    let sanitizedValue = value;

    if (field === 'holderName') sanitizedValue = sanitizeHolderName(value);
    if (field === 'cardNumber') sanitizedValue = sanitizeCardNumber(value);
    if (field === 'expiry') sanitizedValue = sanitizeExpiry(value);
    if (field === 'cvc') sanitizedValue = sanitizeCvc(value);

    setCard((prev) => ({ ...prev, [field]: sanitizedValue }));
  };

  const increaseQty = () => setQuantity((prev) => Math.min(prev + 1, 8));
  const decreaseQty = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const hasMissingCardFields = () => {
    return [card.holderName, card.cardNumber, card.expiry, card.cvc].some((field) => !field.trim());
  };

  const hasInvalidCardFormat = () => {
    const holderNameIsValid =
      /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(card.holderName.trim());
    const cardNumberIsValid = card.cardNumber.replace(/\D/g, '').length === 16;
    const expiryIsValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry);
    const cvcIsValid = /^\d{3}$/.test(card.cvc);

    return !(holderNameIsValid && cardNumberIsValid && expiryIsValid && cvcIsValid);
  };

  const submitPayment = async () => {
    if (!event || !selectedTier) {
      setStatusType('error');
      setStatus('Selecciona un concierto antes de continuar con la compra');
      return;
    }

    const session = authService.getSession();
    if (!session) {
      setStatusType('error');
      setStatus('Debes iniciar sesion para confirmar la compra');
      return;
    }

    if (hasMissingCardFields()) {
      setStatusType('error');
      setStatus('Completa todos los campos de la tarjeta para continuar');
      return;
    }

    if (hasInvalidCardFormat()) {
      setStatusType('error');
      setStatus('Verifica los datos: nombre solo letras, tarjeta y CVC numericos, expiracion MM/AA');
      return;
    }

    try {
      setLoading(true);
      const result = await paymentService.processCardPayment(card, summary.total);

      reservationService.addReservation(session.user.email, {
        eventName: event.title,
        eventDate: event.dateLabel.split(' - ')[0] ?? event.dateLabel,
        venue: event.venue,
        quantity,
        amountPaid: summary.total,
        status: 'CONFIRMED',
      });

      setStatusType('success');
      setStatus(`Pago aprobado - Operacion ${result.operationId}`);
      navigate('/dashboard', {
        state: {
          purchaseSuccess: 'Compra realizada correctamente',
        },
      });
    } catch (error) {
      setStatusType('error');
      if (error instanceof Error) {
        setStatus(error.message);
      } else {
        setStatus('No fue posible procesar el pago');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    event,
    selectedTierId,
    setSelectedTierId,
    selectedTier,
    quantity,
    increaseQty,
    decreaseQty,
    card,
    updateCardField,
    summary,
    submitPayment,
    status,
    statusType,
    loading,
  };
};
