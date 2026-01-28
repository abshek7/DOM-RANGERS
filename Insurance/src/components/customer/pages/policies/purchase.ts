import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Policy } from '../../../../models/policies';
import { PolicyService } from '../../../../services/policyservice';
import { CustomerService } from '../../../../services/customerservice';

@Component({
    selector: 'app-purchase',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './purchase.html'
})
export class PurchaseComponent implements OnInit {
    policy: Policy | null = null;
    loading: boolean = false;
    policyId: string = '';
    customerId: string = '';
    age: number = 25;
    duration: number = 1;
    recalculatedPremium: number = 0;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private policyService: PolicyService,
        private customerService: CustomerService
    ) { }

    ngOnInit(): void {
        this.policyId = this.route.snapshot.paramMap.get('id') || '';
        if (this.policyId) {
            this.loadPolicyDetails();
        } else {
            alert('No policy selected.');
            this.router.navigate(['/customer/marketplace']);
        }

        this.route.queryParams.subscribe(params => {
            if (params['age']) this.age = +params['age'];
        });

        this.customerService.getUsers().subscribe({
            next: (users) => {
                const firstCustomer = users.find(u => u.role === 'customer');
                if (firstCustomer) {
                    this.customerService.getCustomerByUserId(firstCustomer.id).subscribe({
                        next: (customers) => {
                            if (customers.length > 0) {
                                this.customerId = customers[0].id;
                            }
                        }
                    });
                }
            }
        });
    }

    loadPolicyDetails(): void {
        this.loading = true;
        this.policyService.getPolicyById(this.policyId).subscribe({
            next: (policy) => {
                this.policy = policy;
                this.calculateValues();
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    getAgeFactor(age: number): number {
        if (age <= 25) return 1.0;
        if (age <= 35) return 1.2;
        return 1.5;
    }

    calculateValues(): void {
        if (!this.policy) return;
        const factor = this.getAgeFactor(this.age);
        this.recalculatedPremium = Math.round(this.policy.premium * factor);
        this.duration = this.policy.duration;
    }

    onSubmit(): void {
        if (!this.policy) {
            alert('Policy details not loaded. Please try again.');
            return;
        }
        if (!this.customerId) {
            alert('Customer identification failed.');
            return;
        }

        this.loading = true;
        this.customerService.getCustomerById(this.customerId).subscribe(customer => {
            const newPolicy = {
                policyId: this.policyId,
                policyName: this.policy?.name || '',
                premium: this.recalculatedPremium,
                coverage: this.policy?.coverage || 0,
                duration: this.duration,
                status: 'pending' as any,
                renewalDate: new Date(Date.now() + this.duration * 365 * 24 * 60 * 60 * 1000).toISOString(),
                payments: []
            };

            const updatedPolicies = [...(customer.policies || []), newPolicy];
            this.customerService.updateCustomer(this.customerId, { policies: updatedPolicies }).subscribe({
                next: () => {
                    alert('Policy purchased successfully!');
                    this.router.navigate(['/customer/my-policies']);
                },
                error: () => {
                    alert('Purchase failed.');
                    this.loading = false;
                }
            });
        });
    }
}
