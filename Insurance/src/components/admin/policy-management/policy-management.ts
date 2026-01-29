import {ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/adminservice';
import { Policies } from '../../../models/policies';

@Component({
  selector: 'app-policy-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './policy-management.html',
  styleUrl: './policy-management.css'
})
export class PolicyManagement implements OnInit {
  policies: Policies[] = [];
  customers:any[] = [];
  agents:any[] = [];

  activeTab:'policies' | 'requests' = 'policies';

  showAssignModal = false;
  selectedApplication:any = null;
  selectedAgentId:string = '';


  policy:any = {
    name: '',
    type: '',
    premium: '',
    coverage: '',
    duration: '',
    description: '',
    featuresText: ''
  };

  showEditModal = false;
  selectedPolicy:any = null;

  constructor(private adminService: AdminService,private c:ChangeDetectorRef) {}

  ngOnInit() {
    this.loadPolicies();
    this.loadCustomers();
    this.loadAgents();
  }

  loadPolicies() {
    this.adminService.getPolicies().subscribe((r:Policies[]) => {
      this.policies = r;
      this.c.detectChanges();
    });
  }

  addPolicy() {
    const payload = {
      id: 'POL-' + ((parseInt(this.policies[this.policies.length - 1]?.id.split('-')[1]) || 999) + 1),
      name: this.policy.name,
      type: this.policy.type,
      premium: Number(this.policy.premium),
      coverage: Number(this.policy.coverage),
      duration: Number(this.policy.duration),
      description: this.policy.description,
      features: this.policy.featuresText.split(',').map((f:string) => f.trim()),
      createdAt: new Date().toISOString().split('T')[0],
      cancellationRequests: [],
      endorsementRequests: []
    };

    this.adminService.addPolicy(payload).subscribe(() => {
      this.loadPolicies();
      this.resetForm();
      this.c.detectChanges();
    });
  }

  resetForm() {
    this.policy = {
      name: '',
      type: '',
      premium: '',
      coverage: '',
      duration: '',
      description: '',
      featuresText: ''
    };
  }

  openEdit(p:Policies) {
    this.selectedPolicy = {
      ...p,
      featuresText: p.features.join(', ')
    };
    this.showEditModal = true;
  }

  closeEdit() {
    this.showEditModal = false;
    this.selectedPolicy = null;
  }

  updatePolicy() {
    const payload = {
      name: this.selectedPolicy.name,
      type: this.selectedPolicy.type,
      premium: Number(this.selectedPolicy.premium),
      coverage: Number(this.selectedPolicy.coverage),
      duration: Number(this.selectedPolicy.duration),
      description: this.selectedPolicy.description,
      features: this.selectedPolicy.featuresText.split(',').map((f:string) => f.trim())
    };

    this.adminService.updatePolicy(this.selectedPolicy.id, payload).subscribe(() => {
      this.loadPolicies();
      this.closeEdit();
      this.c.detectChanges();
    });
  }

  deletePolicy(id:string) {
    this.adminService.deletePolicy(id).subscribe(() => {
      this.loadPolicies();
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

  policyApplications() {
  return this.customers.flatMap(c =>
    (c.policies || [])
      .filter((p: any) =>
        !p.assignedAgentId || p.status !== 'Assigned'
      )
      .map((p: any) => ({
        customerId: c.id,
        policyId: p.policyId,
        status: p.status,
        assignedAgentId: p.assignedAgentId || null
      }))
  );
}


  openAssign(app:any) {
    this.selectedApplication = app;
    this.selectedAgentId = app.assignedAgentId || '';
    this.showAssignModal = true;
  }

  closeAssign() {
    this.showAssignModal = false;
    this.selectedApplication = null;
    this.selectedAgentId = '';
  }

  assignAgent() {
  const customer = this.customers.find(
    c => c.id === this.selectedApplication.customerId
  );
  if (!customer) return;

  const agent = this.agents.find(
    a => a.id === this.selectedAgentId
  );
  if (!agent) return;

  const policy = customer.policies.find(
    (p: any) => p.policyId === this.selectedApplication.policyId
  );
  if (!policy) return;
  const updatedPolicies = customer.policies.map((p: any) =>
    p.policyId === policy.policyId
      ? {
          ...p,
          assignedAgentId: agent.id,
          status: 'Assigned'
        }
      : p
  );
  const updatedAssignedCustomers = agent.assignedCustomers?.includes(customer.id)
    ? agent.assignedCustomers
    : [...(agent.assignedCustomers || []), customer.id];
  const saleEntry = {
    policyId: policy.policyId,
    customerId: customer.id,
    premium: policy.premium,
    soldAt: new Date().toISOString()
  };

  const updatedSales = [
    ...(agent.sales || []),
    saleEntry
  ];
  const commissionAmount =
    policy.premium * (agent.commissionRate || 0);

  const commissionEntry = {
    policyId: policy.policyId,
    claimId: null,
    amount: commissionAmount,
    status: 'pending' as 'pending'
  };

  const updatedCommissions = [
    ...(agent.commissions || []),
    commissionEntry
  ];

  const updatedAgent = {
    assignedCustomers: updatedAssignedCustomers,
    sales: updatedSales,
    commissions: updatedCommissions,
    totalPoliciesSold: (agent.totalPoliciesSold || 0) + 1
  };

  this.adminService.updateCustomer(customer.id, {
    policies: updatedPolicies
  }).subscribe(() => {
    this.adminService.updateAgent(agent.id, updatedAgent).subscribe(() => {
      this.loadCustomers();
      this.loadAgents();
      this.closeAssign();
      this.c.detectChanges();
    });
  });
}


}
