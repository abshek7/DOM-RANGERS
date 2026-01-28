export interface DashboardStats {
  totalPolicies: number;
  pendingClaims: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'policy' | 'claim';
  title: string;
  description: string;
  date: string;
  status: string;
}
