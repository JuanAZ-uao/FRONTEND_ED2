export interface PaymentCard {
  holderName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

export interface PaymentSummary {
  subtotal: number;
  serviceFee: number;
  insurance: number;
  total: number;
}
