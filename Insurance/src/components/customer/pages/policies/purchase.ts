import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Policies } from '../../../../models/policies';
import { PolicyService } from '../../../../services/policyservice';
import { CustomerService } from '../../../../services/customerservice';
import { AuthService } from '../../../../app/core/services/auth.service';
@Component({
    selector: 'app-purchase',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './purchase.html'
})
export class PurchaseComponent implements OnInit {
    policy: Policies | null = null;
    loading: boolean = false;
    policyId: string = '';
    customerId: string = '';
    age: number = 25;
    duration: number = 1;
    recalculatedPremium: number = 0;
    isAlreadyOwned: boolean = false;
    ownedPolicyStatus: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private policyService: PolicyService,
        private customerService: CustomerService,
        private authService: AuthService
    ) {

        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state && navigation.extras.state['policy']) {
            this.policy = navigation.extras.state['policy'];
            this.calculateValues();
        }
    }

    ngOnInit(): void {
  this.policyId = this.route.snapshot.paramMap.get('id') || '';

  if (!this.policy && this.policyId) {
    this.loadPolicyDetails();
  }

  const userId = this.authService.user?.id;
  if (!userId) return;

  this.customerService.getCustomers().subscribe(customers => {
    const customer = customers.find(c => c.userId === userId);
    if (!customer) return;

    this.customerId = customer.id;

    const owned = customer.policies?.find(p => p.policyId === this.policyId);
    if (owned) {
      this.isAlreadyOwned = true;
      this.ownedPolicyStatus = owned.status;
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

            if (customer.policies?.some((p: any) => p.policyId === this.policyId)) {
                alert('Policy already owned');
                this.loading = false;
                return;
            }

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
