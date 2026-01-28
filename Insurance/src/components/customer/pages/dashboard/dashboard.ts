import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardStats } from '../../../../models/dashboard';
import { CustomerService } from '../../../../services/customerservice';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
    stats: DashboardStats = {
        totalPolicies: 0,
        pendingClaims: 0,
        recentActivity: []
    };
    loading: boolean = true;

    constructor(
        private customerService: CustomerService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadDashboardData();
    }

    loadDashboardData(): void {
        this.loading = true;
        this.customerService.getUsers().subscribe({
            next: (users) => {
                const firstCustomer = users.find(u => u.role === 'customer');
                if (firstCustomer) {
                    this.customerService.getCustomerByUserId(firstCustomer.id).subscribe({
                        next: (customers) => {
                            if (customers.length > 0) {
                                this.fetchStats(customers[0].id);
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

    private fetchStats(customerId: string): void {
        this.customerService.getDashboardStats(customerId).subscribe({
            next: (stats) => {
                this.stats = stats;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    getStatusClass(status: string): string {
        const s = status.toLowerCase();
        if (['active', 'approved', 'paid'].includes(s)) return 'bg-green-100 text-green-800';
        if (['pending'].includes(s)) return 'bg-yellow-100 text-yellow-800';
        if (['rejected', 'cancelled', 'expired'].includes(s)) return 'bg-red-100 text-red-800';
        return 'bg-blue-100 text-blue-800';
    }
}
