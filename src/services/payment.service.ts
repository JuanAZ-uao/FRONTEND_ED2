import type { PaymentCard, PaymentSummary } from '../models/payment.model';
import { wait } from './api.service';

const calculateSummary = (subtotal: number): PaymentSummary => {
  const serviceFee = Math.round(subtotal * 0.1);
  const insurance = Math.round(subtotal * 0.03);

  return {
    subtotal,
    serviceFee,
    insurance,
    total: subtotal + serviceFee + insurance,
  };
};

const processCardPayment = async (card: PaymentCard, total: number) => {
  await wait(320);

  if (!card.holderName || !card.cardNumber || !card.expiry || !card.cvc) {
    throw new Error('Completa todos los datos de la tarjeta');
  }

  return {
    status: 'APPROVED',
    operationId: `OP-${Math.floor(Math.random() * 1000000)}`,
    amount: total,
  };
};

export const paymentService = {
  calculateSummary,
  processCardPayment,
};
