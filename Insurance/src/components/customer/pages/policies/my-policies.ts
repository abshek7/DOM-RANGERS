import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomerService } from '../../../../services/customerservice';
import { PolicyService } from '../../../../services/policyservice';
import { Customer } from '../../../../models/customers';

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
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadCustomerData();
    }

    loadCustomerData(): void {
        this.loading = true;
        this.customerService.getUsers().subscribe({
            next: (users) => {
                const firstCustomer = users.find(u => u.role === 'customer');
                if (firstCustomer && firstCustomer.id !== undefined) {
                    this.customerService.getCustomerByUserId(firstCustomer.id).subscribe({
                        next: (customers) => {
                            if (customers.length > 0) this.customer = customers[0];
                            this.loading = false;
                            this.cdr.detectChanges();
                        },
                        error: () => {
                            this.loading = false;
                            this.cdr.detectChanges();
                        }
                    });
                } else {
                    this.loading = false;
                    this.cdr.detectChanges();
                }
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
        if (s === 'active' || s === 'approved') return 'bg-green-100 text-green-800';
        if (s === 'pending') return 'bg-yellow-100 text-yellow-800';
        if (s === 'cancelled' || s === 'expired' || s === 'rejected') return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    }
}
