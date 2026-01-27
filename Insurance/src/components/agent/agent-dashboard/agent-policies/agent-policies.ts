import { Component, OnInit } from '@angular/core';
import { PoliciesService } from '../../../../services/policiesService';
import { Policies } from '../../../../models/policies';

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

@Component({
  standalone: true,
  selector: 'agent-policies',
  imports: [LucideAngularModule, DatePipe, CurrencyPipe],
  templateUrl: './agent-policies.html',
})
export class AgentPolicies implements OnInit {
  selectedPolicy: Policies | null = null;
  displayedPolicies: Policies[] = [];

  // Icons
  readonly FileText = FileText;
  readonly IndianRupee = IndianRupee;
  readonly Shield = Shield;
  readonly Clock = Clock;
  readonly Calendar = Calendar;
  readonly CheckCircle = CheckCircle;
  readonly ChevronDown = ChevronDown;

  constructor(public policiesService: PoliciesService) {}

  ngOnInit(): void {
    this.policiesService.loadPolicies();
    this.displayedPolicies = this.policiesService.policies();
  }

  onSelectPolicy(policyId: string): void {
    if (policyId === 'all') {
      this.selectedPolicy = null;
      this.displayedPolicies = this.policiesService.policies();
      return;
    }

    const policy = this.policiesService.policies().find((p) => p.id === policyId) ?? null;

    this.selectedPolicy = policy;
    this.displayedPolicies = policy ? [policy] : [];
  }

  policyCardClass(policy: Policies): string {
    return this.selectedPolicy?.id === policy.id
      ? 'border-indigo-500 ring-2 ring-indigo-100'
      : 'border-gray-200 hover:shadow-lg';
  }
}
