export interface Policies {
  id: string; 
  name: string;
  type: 'health' | 'life' | 'vehicle' | 'travel';
  premium: number;
  coverage: number;
  duration: number;
  description: string;
  features: string[];
  createdAt: string;

  cancellationRequests?: {
    customerId: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    requestedAt: string;
  }[];

  endorsementRequests?: {
    customerId: string;
    changeRequested: string;
    status: 'pending' | 'approved' | 'rejected';
    requestedAt: string;
  }[];
}


