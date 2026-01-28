export interface Payment {
    id: string;
    customerId: string;
    policyId: string;
    amount: number;
    date?: string;
    dueDate?: string;
    status: 'paid' | 'pending' | 'success' | 'failed' | 'overdue';
    paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet';
    transactionId: string;
    description: string;
}
