import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Claim } from '../../../../models/claims';
import { ClaimService } from '../../../../services/claimservice';
import { CustomerService } from '../../../../services/customerservice';

@Component({
    selector: 'app-track-claims',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, TitleCasePipe],
    templateUrl: './track-claims.html'
})
export class TrackClaimsComponent implements OnInit {
    claims: Claim[] = [];
    loading: boolean = true;
    selectedFilter: string = 'all';
    statusOptions = ['all', 'pending', 'approved', 'rejected'];

    constructor(
        private claimService: ClaimService,
        private customerService: CustomerService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadClaims();
    }

    loadClaims(): void {
        this.loading = true;
        this.customerService.getUsers().subscribe({
            next: (users) => {
                const firstCustomer = users.find(u => u.role === 'customer');
                if (firstCustomer) {
                    this.customerService.getCustomerByUserId(firstCustomer.id).subscribe({
                        next: (customers) => {
                            if (customers.length > 0) {
                                const customerId = customers[0].id;
                                this.claimService.getClaimsByCustomer(customerId).subscribe({
                                    next: (claims) => {
                                        this.claims = claims;
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

    get filteredClaims(): Claim[] {
        if (this.selectedFilter === 'all') return this.claims;
        return this.claims.filter(c => c.status.toLowerCase() === this.selectedFilter.toLowerCase());
    }

    getStatusClass(status: string): string {
        const s = status.toLowerCase();
        if (s === 'approved') return 'bg-green-100 text-green-800';
        if (s === 'pending') return 'bg-yellow-100 text-yellow-800';
        if (s === 'rejected') return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    }
}
