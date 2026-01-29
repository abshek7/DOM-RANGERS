import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomerService } from '../../../../services/customerservice';
import { PolicyService } from '../../../../services/policyservice';
import { Customer } from '../../../../models/customers';
import { AuthService } from '../../../../app/core/services/auth.service';
@Component({
    selector: 'app-my-policies',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './my-policies.html'
})
export class MyPoliciesComponent implements OnInit {
    customer: Customer | null = null;
    loading: boolean = true;
    showEndorsementModal: boolean = false;
    selectedPolicyId: string = '';
    endorsementValue: string = '';
    showCancellationModal: boolean = false;
    cancellationReason: string = '';

    constructor(
        private customerService: CustomerService,
        private policyService: PolicyService,
        private cdr: ChangeDetectorRef,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.loadCustomerData();
    }

    loadCustomerData(): void {
        this.loading = true;

        const userId = this.authService.user?.id;
        if (!userId) {
            this.loading = false;
            this.cdr.detectChanges();
            return;
        }

        this.customerService.getCustomers().subscribe({
            next: (customers) => {
                this.customer = customers.find(c => c.userId === userId) || null;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }


    cancelPolicy(policyId: string): void {
        this.selectedPolicyId = policyId;
        this.showCancellationModal = true;
    }

    submitCancellation(): void {
        if (!this.customer || !this.selectedPolicyId) return;

        const request = {
            customerId: this.customer.id,
            date: new Date().toISOString(),
            reason: this.cancellationReason
        };
        this.policyService.submitCancellationRequest(this.selectedPolicyId, request).subscribe({
            next: () => {
                alert('Cancellation request sent to agent.');
                this.showCancellationModal = false;
                this.cancellationReason = '';
                this.cdr.detectChanges();
            },
            error: () => alert('Failed to send cancellation request.')
        });
    }

    openEndorsement(policyId: string): void {
        this.selectedPolicyId = policyId;
        this.showEndorsementModal = true;
    }

    submitEndorsement(): void {
        if (!this.customer || !this.selectedPolicyId) return;

        const request = {
            customerId: this.customer.id,
            details: this.endorsementValue,
            date: new Date().toISOString()
        };

        this.policyService.submitEndorsementRequest(this.selectedPolicyId, request).subscribe({
            next: () => {
                alert('Endorsement request sent to agent.');
                this.showEndorsementModal = false;
                this.endorsementValue = '';
                this.cdr.detectChanges();
            },
            error: () => alert('Failed to send endorsement request.')
        });
    }

    getStatusClass(status: string): string {
        const s = status.toLowerCase();
        if (s === 'active' || s === 'approved') return 'bg-green-50 text-green-700';
        if (s === 'pending') return 'bg-yellow-50 text-yellow-700';
        if (s === 'cancelled' || s === 'expired' || s === 'rejected') return 'bg-red-50 text-red-700';
        return 'bg-slate-100 text-slate-600';
    }
}
