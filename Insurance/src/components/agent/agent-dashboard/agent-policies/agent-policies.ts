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
import { DatePipe, CurrencyPipe } from '@angular/common';
import { PoliciesService } from '../../../../services/policiesService';

@Component({
  standalone: true,
  selector: 'agent-policies',
  imports: [LucideAngularModule, DatePipe, CurrencyPipe],
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
    this.adminService.getAgents().subscribe((agents) => {
      const agent = agents.find(a => a.userId === this.auth.user?.id);
      if (!agent) return;

      this.adminService.getCustomers().subscribe((customers: any) => {
        const policies = customers
          .flatMap((c:any) => c.policies || [])
          .filter((p:any) => p.assignedAgentId === agent.id);
        console.log('Agent Policies:', policies);
        this.allPolicies = policies;
        this.displayedPolicies = [...policies];
        console.log('Displayed Policies:', this.displayedPolicies);
        this.ChangeDetectorRef?.detectChanges();
      });
    });
  }

  onSelectPolicy(policyId: string): void {
    if (policyId === 'all') {
      this.selectedPolicy = null;
      this.displayedPolicies = [...this.allPolicies];
      return;
    }

    const policy = this.allPolicies.find(p => p.policyId === policyId) ?? null;
    this.selectedPolicy = policy;
    this.displayedPolicies = policy ? [policy] : [];
  }

  policyCardClass(policy: any): string {
    return this.selectedPolicy?.id === policy.policyId
      ? 'border-indigo-500 ring-2 ring-indigo-100'
      : 'border-gray-200 hover:shadow-lg';
  }
}
