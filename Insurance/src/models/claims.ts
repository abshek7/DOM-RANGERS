export interface Claim {
  id: string;
  claimId: string;
  customerId: string;
  policyId: string;
  policyNumber: string;
  agentId?: string;
  claimAmount: number;
  type: string;
  description: string;
  status: 'pending' | 'under-review' | 'approved' | 'rejected';
  incidentDate: string;
  contactNumber: string;
  bankAccount: string;
  ifscCode: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  documents: ClaimDocument[];
  timeline: ClaimTimeline[];
}

export interface ClaimDocument {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface ClaimTimeline {
  status: string;
  updatedBy: string;
  date: string;
}
