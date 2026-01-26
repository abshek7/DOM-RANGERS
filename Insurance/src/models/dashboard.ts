export interface DashboardStats {
  activePolicies: number;
  pendingClaims: number;
  totalDues: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'policy' | 'claim' | 'payment';
  title: string;
  description: string;
  date: string;
  status: string;
}
