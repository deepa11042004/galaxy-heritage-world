/** Online payment options offered on /pay-now. Every "Pay Now" button on the site opens that page. */
export const PAY_NOW_PATH = '/pay-now';

export const PAYMENT_OPTIONS = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    logo: '/media/payments/razorpay.svg',
    logoSize: { width: 1896, height: 401 },
    url: 'https://pages.razorpay.com/pl_TfnPKNHuWwO1UY/view',
    text: 'Pay securely with UPI, cards, net banking and wallets through the Razorpay payment page.',
  },
  {
    id: 'cashfree',
    name: 'Cashfree',
    logo: '/media/payments/cashfree.svg',
    logoSize: { width: 148, height: 25 },
    url: 'https://payments.cashfree.com/forms/ghwhospitality',
    text: 'Pay securely with UPI, cards, net banking and wallets through the Cashfree payment form.',
  },
] as const;
