import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerPolicy, Policy } from '../../../../models/policies';
import { CustomerService } from '../../../services/customer.service';
import { PolicyService } from '../../../services/policy.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-my-policies',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './my-policies.component.html',
    styleUrls: ['./my-policies.component.css']
})
export class MyPoliciesComponent implements OnInit {
    myPolicies: any[] = [];
    loading: boolean = true;
    customerId: string = 'CUST-001'; // In real app, get from auth service

    constructor(
        private customerService: CustomerService,
        private policyService: PolicyService
    ) { }

    ngOnInit(): void {
        this.loadMyPolicies();
    }

    loadMyPolicies(): void {
        this.loading = true;

        // Fetch customer data which includes their policies
        this.customerService.getCustomerById(this.customerId).subscribe({
            next: (customer: any) => {
                if (customer && customer.policies) {
                    this.myPolicies = customer.policies.map((policy: any) => ({
                        id: policy.policyId,
                        customerId: this.customerId,
                        policyId: policy.policyId,
                        policyNumber: policy.policyId,
                        startDate: policy.startDate,
                        endDate: policy.renewalDate,
                        renewalDate: policy.renewalDate,
                        paymentStatus: policy.status === 'active' ? 'Paid' : 'Pending',
                        status: policy.status,
                        premiumPaid: policy.premium,
                        nextPremiumDue: policy.premium,
                        nextPremiumDate: policy.renewalDate,
                        policyDetails: {
                            id: policy.policyId,
                            policyName: policy.policyName,
                            type: policy.type,
                            premium: policy.premium,
                            coverage: policy.coverage,
                            duration: '1 Year',
                            description: policy.description,
                            features: policy.features || [],
                            minAge: 18,
                            maxAge: 65,
                            icon: this.getPolicyIcon(policy.type),
                            rating: 4.5,
                            reviewCount: 100
                        }
                    }));
                }
                this.loading = false;
            },
            error: (error: any) => {
                console.error('Error loading policies:', error);
                this.loading = false;
                this.myPolicies = [];
            }
        });
    }

    getPolicyIcon(type: string): string {
        const icons: { [key: string]: string } = {
            'health': '🏥',
            'life': '❤️',
            'vehicle': '🚗',
            'travel': '✈️',
            'home': '🏠'
        };
        return icons[type.toLowerCase()] || '📄';
    }

    getStatusClass(status: string): string {
        return status.toLowerCase() === 'active' ? 'status-active' : 'status-inactive';
    }

    getDaysUntilRenewal(renewalDate: string): number {
        const today = new Date();
        const renewal = new Date(renewalDate);
        const diffTime = renewal.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    downloadPolicy(policy: any): void {
        // In real app, this would generate and download actual PDF
        // For now, create a simple text file with policy details
        const policyText = `
INSURANCE POLICY DOCUMENT
========================

Policy Number: ${policy.policyNumber}
Policy Name: ${policy.policyDetails?.policyName}
Type: ${policy.policyDetails?.type}
Status: ${policy.status}

Coverage Details:
- Coverage Amount: ₹${policy.policyDetails?.coverage}
- Premium: ₹${policy.premiumPaid}/year
- Duration: ${policy.policyDetails?.duration}

Policy Period:
- Start Date: ${policy.startDate}
- End Date: ${policy.endDate}
- Renewal Date: ${policy.renewalDate}

Features:
${policy.policyDetails?.features?.map((f: string) => `- ${f}`).join('\n')}

Customer ID: ${policy.customerId}
Payment Status: ${policy.paymentStatus}

This is a computer-generated document.
        `;

        const blob = new Blob([policyText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${policy.policyNumber}_Policy.txt`;
        link.click();
        window.URL.revokeObjectURL(url);
    }
}
