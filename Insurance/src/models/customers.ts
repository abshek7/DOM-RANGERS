export interface Customer {
  id: string; 
  userId: number;
  nominee: string;
  address: string;
  dateOfBirth: string;
  aadharNumber: string;
  panNumber: string;
  assignedAgent: {
    agentId: string;
    name: string;
    commissionRate: number;
  };

  policies: {
    policyId: string;
    policyName: string;
    premium: number;
    status: 'active' | 'expired' | 'cancelled';
    renewalDate: string;

    payments: {
      amount: number;
      date: string;
      status: 'paid' | 'pending' | 'failed';
      transactionId?: string;
    }[];

    documents: {
      type: string;
      fileName: string;
      uploadedAt: string;
      verified: boolean;
    }[];
  }[];

  claims: string[];
}
