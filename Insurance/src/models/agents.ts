export interface Agent {
  id: string;
  userId: number;
  licenseNumber: string;
  commissionRate: number;
  assignedCustomers: string[];
  totalPoliciesSold: number;
  sales: {
    policyId: string;
    customerId: string;
    premium: number;
    soldAt: string;
  }[];
  commissions: {
    policyId: string;
    claimId: string;
    amount: number;
    status: 'pending' | 'earned';
    earnedAt?: string;
  }[];
  communicationLogs: {
    customerId: string;
    message: string;
    date: string;
  }[];
}