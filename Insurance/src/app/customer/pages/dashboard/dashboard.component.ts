import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardStats, ActivityItem } from '../../../../models/dashboard';
import { CustomerService } from '../../../services/customer.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    stats: DashboardStats = {
        activePolicies: 0,
        pendingClaims: 0,
        totalDues: 0,
        recentActivity: []
    };

    loading: boolean = true;
    customerId: string = 'CUST-001'; // In real app, get from auth service

    constructor(private customerService: CustomerService) { }

    ngOnInit(): void {
        this.loadDashboardData();
    }

    loadDashboardData(): void {
        this.loading = true;

        // Fetch customer data from db.json
        this.customerService.getCustomerById(this.customerId).subscribe({
            next: (customer: any) => {
                if (customer) {
                    // Count active policies
                    this.stats.activePolicies = customer.policies?.filter((p: any) => p.status === 'active').length || 0;

                    // Count pending claims (would need claims endpoint in real app)
                    this.stats.pendingClaims = 0;

                    // Calculate total dues from pending payments
                    this.stats.totalDues = 0;
                    if (customer.policies) {
                        customer.policies.forEach((policy: any) => {
                            if (policy.payments) {
                                policy.payments.forEach((payment: any) => {
                                    if (payment.status === 'pending') {
                                        this.stats.totalDues += payment.amount;
                                    }
                                });
                            }
                        });
                    }

                    // Build recent activity from policies and payments
                    this.stats.recentActivity = [];

                    if (customer.policies) {
                        customer.policies.forEach((policy: any) => {
                            // Add policy activity
                            this.stats.recentActivity.push({
                                id: policy.policyId,
                                type: 'policy',
                                title: `${policy.policyName} - ${policy.status}`,
                                description: policy.description,
                                date: policy.startDate,
                                status: policy.status
                            });

                            // Add payment activity
                            if (policy.payments) {
                                policy.payments.slice(0, 2).forEach((payment: any) => {
                                    this.stats.recentActivity.push({
                                        id: payment.paymentId,
                                        type: 'payment',
                                        title: `Payment ${payment.status}`,
                                        description: `₹${payment.amount} for ${policy.policyName}`,
                                        date: payment.date || payment.dueDate,
                                        status: payment.status
                                    });
                                });
                            }
                        });
                    }

                    // Sort by date and take most recent 5
                    this.stats.recentActivity.sort((a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    ).slice(0, 5);
                }

                this.loading = false;
            },
            error: (error: any) => {
                console.error('Error loading dashboard data:', error);
                this.loading = false;
            }
        });
    }

    getActivityIcon(type: string): string {
        const icons: { [key: string]: string } = {
            policy: '📄',
            claim: '⚠️',
            payment: '💰'
        };
        return icons[type] || '📋';
    }

    getStatusClass(status: string): string {
        const classes: { [key: string]: string } = {
            completed: 'status-success',
            approved: 'status-success',
            active: 'status-success',
            paid: 'status-success',
            pending: 'status-warning',
            rejected: 'status-error'
        };
        return classes[status] || 'status-info';
    }
}
