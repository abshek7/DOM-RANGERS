import { Component ,OnInit} from '@angular/core';
import { AdminService } from '../../../services/adminservice';
@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {

  usersCount = 0;
  agentsCount = 0;
  policiesCount = 0;
  pendingClaims = 0;

  activities:any[] = [];
  policyDistribution:any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
      this.adminService.getUsers().subscribe((r:any[]) => {
      this.usersCount = r.length;
    });

    this.adminService.getAgents().subscribe((r:any[]) => {
      this.agentsCount = r.length;
    });

    this.adminService.getPolicies().subscribe((r:any[]) => {
      this.policiesCount = r.length;
      this.policyDistribution = r.map(p => ({
        name: p.name,
        value: p.coverage,
        percent: (p.coverage / 1000000) * 100
      }));
    });

    this.adminService.getClaims().subscribe((r:any[]) => {
      this.pendingClaims = r.filter(c => c.status === 'pending').length;
      this.activities = r.slice(0, 4);
    });

  }

}