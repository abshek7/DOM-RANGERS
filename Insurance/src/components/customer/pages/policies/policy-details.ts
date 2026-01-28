import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Policies } from '../../../../models/policies';
import { PolicyService } from '../../../../services/policyservice';

@Component({
    selector: 'app-policy-details',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './policy-details.html'
})
export class PolicyDetailsComponent implements OnInit {
    policy: Policies | null = null;
    loading: boolean = true;
    policyId: string = '';

    constructor(
        private route: ActivatedRoute,
        private policyService: PolicyService
    ) { }

    ngOnInit(): void {
        this.policyId = this.route.snapshot.paramMap.get('id') || '';
        if (this.policyId) {
            this.loadPolicyDetails();
        }
    }

    loadPolicyDetails(): void {
        this.loading = true;
        this.policyService.getPolicyById(this.policyId).subscribe({
            next: (policies) => {
                this.policy = policies;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading policy details:', error);
                this.loading = false;
            }
        });
    }
}
