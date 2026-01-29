import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../services/adminservice';
import { AuthService } from '../../../../app/core/services/auth.service';
import { Policies } from '../../../../models/policies';
import { Customer } from '../../../../models/customers';
import { ChangeDetectorRef } from '@angular/core';
import {
  LucideAngularModule,
  FileText,
  IndianRupee,
  Shield,
  Clock,
  Calendar,
  CheckCircle,
  ChevronDown,
} from 'lucide-angular';
import {  CurrencyPipe, DatePipe } from '@angular/common';
import { PoliciesService } from '../../../../services/policiesService';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'agent-policies',
  imports: [LucideAngularModule, CurrencyPipe,DatePipe,FormsModule],
  templateUrl: './agent-policies.html',
})
export class AgentPolicies implements OnInit {
  selectedPolicy: Policies | null = null;
  displayedPolicies: any[] = [];
  allPolicies: any[] = [];

  readonly FileText = FileText;
  readonly IndianRupee = IndianRupee;
  readonly Shield = Shield;
  readonly Clock = Clock;
  readonly Calendar = Calendar;
  readonly CheckCircle = CheckCircle;
  readonly ChevronDown = ChevronDown;

  constructor(
    private adminService: AdminService,
    private auth: AuthService,
    public policiesService: PoliciesService
    ,private ChangeDetectorRef:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAgentPolicies();
  }

  private loadAgentPolicies(): void {
  this.adminService.getAgents().subscribe((agents: any[]) => {
    const agent = agents.find(a => a.userId === this.auth.user?.id);
    if (!agent || !agent.sales?.length) {
      this.allPolicies = [];
      this.displayedPolicies = [];
      return;
    }

    const soldPolicyIds = agent.sales.map((s: any) => s.policyId);

    this.adminService.getPolicies().subscribe((policies: any[]) => {
      const assignedPolicies = policies.filter(p =>
        soldPolicyIds.includes(p.id)
      );

      this.allPolicies = assignedPolicies.map(p => {
        const sale = agent.sales.find((s: any) => s.policyId === p.id);
        return {
          ...p,
          soldAt: sale?.soldAt,
          customerId: sale?.customerId,
          soldPremium: sale?.premium
        };
      });
      this.displayedPolicies = [...this.allPolicies];
      this.ChangeDetectorRef.detectChanges();
    });
  });
}

  onSelectPolicy(policyId: string): void {
    if (policyId === 'all') {
      this.selectedPolicy = null;
      this.displayedPolicies = [...this.allPolicies];
      return;
    }

    const policy = this.allPolicies.find(p => p.id === policyId) ?? null;
    this.selectedPolicy = policy;
    this.displayedPolicies = policy ? [policy] : [];
  }

  policyCardClass(policy: any): string {
    return this.selectedPolicy?.id === policy.policyId
      ? 'border-indigo-500 ring-2 ring-indigo-100'
      : 'border-gray-200 hover:shadow-lg';
  }
}
