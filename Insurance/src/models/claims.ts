export interface Claims{
  id: string; // CLAIM-001
  policyId: string;
  customerId: string;
  type: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';

  description: string;

  assignedAgent: {
    agentId: string;
    name: string;
  };

  documents: {
    fileName: string;
    uploadedAt: string;
  }[];

  remarks?: string;

  timeline: {
    status: string;
    updatedBy: 'admin' | 'agent';
    date: string;
  }[];
}
