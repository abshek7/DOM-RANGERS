export interface Payment {
  id: string;
  paymentId: string;
  customerId: string;
  policyId: string;
  policyNumber: string;
  amount: number;
  date?: string;
  dueDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod: string;
  transactionId?: string;
  paymentType: 'premium' | 'claim';
  description: string;
}
