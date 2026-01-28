export interface Policies{
  id: string;
  name: string;
  type: 'health' | 'life' | 'vehicle' | 'travel';
  premium: number;
  coverage: number;
  duration: number;
  description: string;
  features: string[];
  createdAt: string;
  cancellationRequests?:[];
  endorsementRequests?:[];
}
