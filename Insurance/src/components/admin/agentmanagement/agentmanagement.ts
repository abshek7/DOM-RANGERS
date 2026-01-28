import {ChangeDetectorRef, Component ,OnInit} from '@angular/core';
import { AdminService } from '../../../services/adminservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-agentmanagement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agentmanagement.html',
  styleUrl: './agentmanagement.css'
})

export class Agentmanagement implements OnInit {

  agents:any[] = [];
  customers:any[] = [];

  showAssignModal = false;
  showCommissionModal = false;

  selectedAgent:any = null;
  selectedCustomerIds:string[] = [];
  commissionRate:number | null = null;
  constructor(private adminService: AdminService, private c:ChangeDetectorRef) {}

  ngOnInit() {
    this.loadAgents();
    this.loadCustomers();
  }

  loadAgents() {
    this.adminService.getAgents().subscribe((r:any[]) => {
      this.agents = r;
      this.c.detectChanges();
    });
  }

  loadCustomers() {
    this.adminService.getCustomers().subscribe((r:any[]) => {
      this.customers = r;
      this.c.detectChanges();
    });
  }

  customersOfAgent(agentId:string) {
    return this.customers.filter(c =>
      c.policies?.some((p:any) => p.assignedAgentId === agentId)
    );
  
  }
  openAssign(agent:any) {
    this.selectedAgent = agent;
    this.selectedCustomerIds = this.customersOfAgent(agent.id).map(c => c.id);
    this.showAssignModal = true;
  }

  closeAssign() {
    this.showAssignModal = false;
    this.selectedAgent = null;
    this.selectedCustomerIds = [];
  }

  toggleCustomer(id:string) {
    this.selectedCustomerIds.includes(id)
      ? this.selectedCustomerIds = this.selectedCustomerIds.filter(x => x !== id)
      : this.selectedCustomerIds.push(id);
  }

  saveAssignments() {
    const updates = this.customers.map(c => {
      const apps = (c.policyApplications || []).map((p:any) => ({
        ...p,
        assignedAgentId: this.selectedCustomerIds.includes(c.id)
          ? this.selectedAgent.id
          : p.assignedAgentId === this.selectedAgent.id
            ? null
            : p.assignedAgentId
      }));
      return { id: c.id, policyApplications: apps };
    });

    updates.forEach(u => {
      this.adminService.updateCustomer(u.id, {
        policyApplications: u.policyApplications
      }).subscribe();
    });
    this.c.detectChanges();

    this.closeAssign();
  }

  openCommission(agent:any) {
    this.selectedAgent = agent;
    this.commissionRate = agent.commissionRate;
    this.showCommissionModal = true;
  }

  closeCommission() {
    this.showCommissionModal = false;
    this.selectedAgent = null;
    this.commissionRate = null;
  }

  saveCommission() {
    this.adminService.updateAgent(this.selectedAgent.id, {
      commissionRate: Number(this.commissionRate)
    }).subscribe(() => {
      this.loadAgents();
      this.closeCommission();
    });
    this.c.detectChanges();
  }

}
