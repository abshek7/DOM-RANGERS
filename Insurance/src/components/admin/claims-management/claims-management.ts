import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/adminservice';
import { Claims } from '../../../models/claims';
@Component({
  selector: 'app-claims-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './claims-management.html',
  styleUrl: './claims-management.css'
})
export class ClaimsManagement implements OnInit {

  claims:Claims[] = [];
  customers:any[] = [];
  agents:any[] = [];

  filter:'all' | 'pending' | 'approved' | 'rejected' = 'all';

  showModal = false;
  selectedClaim:any = null;
  assignedAgent:any = null;

  constructor(private adminService: AdminService,private c:ChangeDetectorRef) {}

  ngOnInit() {
    this.loadClaims();
    this.loadCustomers();
    this.loadAgents();
  }

  loadClaims() {
    this.adminService.getClaims().subscribe((r:Claims[]) => {
      this.claims = r;
      this.c.detectChanges();
    });
  }

  loadCustomers() {
    this.adminService.getCustomers().subscribe((r:any[]) => {
      this.customers = r;
      this.c.detectChanges();
    });
  }

  loadAgents() {
    this.adminService.getAgents().subscribe((r:any[]) => {
      this.agents = r;
      this.c.detectChanges();
    });
  }

  filteredClaims() {
    if (this.filter === 'all') return this.claims;
    return this.claims.filter(c => c.status === this.filter);
  }

  openClaim(c:any) {
    this.selectedClaim = { ...c, remark: c.remark || '' };

    const customer = this.customers.find(x => x.id === c.customerId);
    const agentId = customer?.policies
      ?.find((p:any) => p.policyId === c.policyId)
      ?.assignedAgentId;

    this.assignedAgent = this.agents.find(a => a.id === agentId) || null;

    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedClaim = null;
    this.assignedAgent = null;
  }

  updateStatus(status:string) {
    const payload = {
      status,
      remark: this.selectedClaim.remark
    };

    this.adminService.updateClaim(this.selectedClaim.id, payload).subscribe(() => {
      this.loadClaims();
      this.closeModal();
      this.c.detectChanges();
    });
  }

}
