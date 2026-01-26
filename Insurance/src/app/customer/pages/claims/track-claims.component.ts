import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Claim } from '../../../../models/claims';

@Component({
    selector: 'app-track-claims',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './track-claims.component.html',
    styleUrls: ['./track-claims.component.css']
})
export class TrackClaimsComponent implements OnInit {
    claims: Claim[] = [];
    loading: boolean = true;
    selectedFilter: string = 'all';

    ngOnInit(): void {
        this.loadClaims();
    }

    loadClaims(): void {
        setTimeout(() => {
            this.claims = [
                {
                    id: '1',
                    claimId: 'CLM-2024-001',
                    customerId: 'CUST-001',
                    policyId: '1',
                    policyNumber: 'POL-2024-001',
                    claimAmount: 25000,
                    type: 'Medical',
                    description: 'Hospitalization expenses',
                    status: 'approved',
                    incidentDate: '2024-01-10',
                    contactNumber: '+91 9876543210',
                    bankAccount: '1234567890',
                    ifscCode: 'HDFC0001234',
                    remarks: 'Claim approved and processed',
                    createdAt: '2024-01-15T10:00:00Z',
                    updatedAt: '2024-01-20T15:30:00Z',
                    documents: [
                        { name: 'medical-bill.pdf', size: 245000, type: 'application/pdf', uploadedAt: '2024-01-15T10:00:00Z' }
                    ],
                    timeline: [
                        { status: 'Submitted', updatedBy: 'customer', date: '2024-01-15T10:00:00Z' },
                        { status: 'Under Review', updatedBy: 'agent', date: '2024-01-17T14:00:00Z' },
                        { status: 'Approved', updatedBy: 'admin', date: '2024-01-20T15:30:00Z' }
                    ]
                }
            ];
            this.loading = false;
        }, 800);
    }

    get filteredClaims(): Claim[] {
        if (this.selectedFilter === 'all') return this.claims;
        return this.claims.filter(c => c.status === this.selectedFilter);
    }

    getStatusClass(status: string): string {
        const classes: { [key: string]: string } = {
            'pending': 'status-pending',
            'under-review': 'status-review',
            'approved': 'status-approved',
            'rejected': 'status-rejected'
        };
        return classes[status] || 'status-pending';
    }

    getStatusIcon(status: string): string {
        const icons: { [key: string]: string } = {
            'pending': '⏳',
            'under-review': '🔍',
            'approved': '✅',
            'rejected': '❌'
        };
        return icons[status] || '📋';
    }
}
