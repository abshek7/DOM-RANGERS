import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';

@Component({
    selector: 'app-file-claim',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './file-claim.component.html',
    styleUrls: ['./file-claim.component.css']
})
export class FileClaimComponent implements OnInit {
    customerId: string = 'CUST-001';
    customerPolicies: any[] = [];
    loading: boolean = true;

    formData = {
        policyId: '',
        claimType: 'medical',
        incidentDate: '',
        claimAmount: 0,
        description: '',
        contactNumber: '',
        bankAccount: '',
        ifscCode: ''
    };

    claimTypes = ['medical', 'accident', 'theft', 'damage', 'other'];

    constructor(
        private customerService: CustomerService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadCustomerPolicies();
    }

    loadCustomerPolicies(): void {
        this.loading = true;
        this.customerService.getCustomerById(this.customerId).subscribe({
            next: (customer: any) => {
                if (customer && customer.policies) {
                    this.customerPolicies = customer.policies.filter((p: any) => p.status === 'active');
                }
                this.loading = false;
            },
            error: (error: any) => {
                console.error('Error loading policies:', error);
                this.loading = false;
            }
        });
    }

    onSubmit(): void {
        if (this.validateForm()) {
            // In real app, submit to backend
            console.log('Claim submitted:', this.formData);
            alert('Claim filed successfully! You will receive a confirmation email shortly.');
            this.router.navigate(['/customer/claims']);
        }
    }

    validateForm(): boolean {
        if (!this.formData.policyId || !this.formData.incidentDate || !this.formData.claimAmount) {
            alert('Please fill in all required fields');
            return false;
        }
        if (this.formData.claimAmount <= 0) {
            alert('Claim amount must be greater than 0');
            return false;
        }
        return true;
    }
}
