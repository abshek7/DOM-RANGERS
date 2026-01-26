export interface PurchaseWizardData {
  policyId: string;
  age: number;
  coverageDuration: number;
  selectedAddons: string[];
  calculatedPremium: number;
  documents: {
    identityProof?: File;
    addressProof?: File;
    photo?: File;
  };
  documentsVerified: boolean;
  paymentMethod: 'credit-card' | 'debit-card' | 'net-banking' | 'google-pay' | 'bank-transfer';
  paymentDetails: PaymentDetails;
}

export interface PaymentDetails {
  cardNumber?: string;
  cardName?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  googlePayEmail?: string;
}
