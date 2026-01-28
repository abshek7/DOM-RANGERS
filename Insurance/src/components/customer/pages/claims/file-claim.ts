import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../../../services/customerservice';
import { ClaimService } from '../../../../services/claimservice';
import { Customer } from '../../../../models/customers';

@Component({
    selector: 'app-file-claim',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './file-claim.html'
})
export class FileClaimComponent implements OnInit {
    customer: Customer | null = null;
    loading: boolean = true;
    activePolicies: any[] = [];
    selectedFiles: string[] = [];
    formData = {
        policyId: '',
        type: 'Health',
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        description: ''
    };
    claimTypes = ['Health', 'Life', 'Vehicle', 'Travel', 'Home'];

    constructor(
        private customerService: CustomerService,
        private claimService: ClaimService,
        private router: Router,
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
                if (firstCustomer) {
                    this.customerService.getCustomerByUserId(firstCustomer.id).subscribe({
                        next: (customers) => {
                            if (customers.length > 0) {
                                this.customer = customers[0];
                                this.activePolicies = this.customer.policies || [];
                            }
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

    onFileSelected(event: any): void {
        const files = event.target.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                this.selectedFiles.push(files[i].name);
            }
            this.cdr.detectChanges();
        }
    }

    onSubmit(): void {
        if (!this.customer || !this.formData.policyId || !this.formData.amount) {
            alert('Please fill in all required fields');
            return;
        }

        const newClaim: any = {
            id: `CLM-${Math.floor(Math.random() * 10000)}`,
            customerId: this.customer.id,
            policyId: this.formData.policyId,
            type: this.formData.type,
            amount: this.formData.amount,
            date: this.formData.date,
            description: this.formData.description,
            status: 'pending',
            documents: this.selectedFiles
        };

        this.claimService.fileClaim(newClaim).subscribe({
            next: () => {
                alert('Claim submitted successfully. An agent will review it shortly.');
                this.router.navigate(['/customer/claims']);
            },
            error: () => alert('Failed to submit claim. Please try again.')
        });
    }
}
