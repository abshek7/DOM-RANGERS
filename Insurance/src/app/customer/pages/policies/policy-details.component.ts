import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Policy } from '../../../../models/policies';
import { PolicyService } from '../../../services/policy.service';

@Component({
    selector: 'app-policy-details',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './policy-details.component.html',
    styleUrls: ['./policy-details.component.css']
})
export class PolicyDetailsComponent implements OnInit {
    policy: Policy | null = null;
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
            next: (policy) => {
                this.policy = policy;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading policy details:', error);
                this.loading = false;
            }
        });
    }

    getStarArray(rating: number): number[] {
        return Array(Math.floor(rating)).fill(0);
    }
}
