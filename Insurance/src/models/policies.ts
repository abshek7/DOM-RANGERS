export interface Policy {
  id: string;
  policyName: string;
  type: string;
  premium: number;
  coverage: number;
  duration: string;
  description: string;
  features: string[];
  minAge: number;
  maxAge: number;
  icon: string;
  rating: number;
  reviewCount: number;
  createdAt?: string;
}

export interface CustomerPolicy {
  id: string;
  customerId: string;
  policyId: string;
  policyNumber: string;
  startDate: string;
  endDate: string;
  renewalDate: string;
  paymentStatus: string;
  status: string;
  premiumPaid: number;
  nextPremiumDue: number;
  nextPremiumDate: string;
}

export interface PolicyFilter {
  type?: string;
  minPremium?: number;
  maxPremium?: number;
  minCoverage?: number;
  maxCoverage?: number;
  rating?: number;
  searchTerm?: string;
}


