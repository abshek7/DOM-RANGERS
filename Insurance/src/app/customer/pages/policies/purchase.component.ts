import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Policy } from '../../../../models/policies';
import { PolicyService } from '../../../services/policy.service';
import { CustomerService } from '../../../services/customer.service';

interface DocumentUpload {
    type: string;
    label: string;
    file: File | null;
    status: 'pending' | 'uploaded' | 'reviewing' | 'approved';
    required: boolean;
}

@Component({
    selector: 'app-purchase',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './purchase.component.html',
    styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
    policy: Policy | null = null;
    loading: boolean = true;
    policyId: string = '';
    customerId: string = 'CUST-001';

    // Customer data (autofilled from profile)
    customerData = {
        fullName: '',
        email: '',
        phone: '',
        address: ''
    };

    // Documents required based on policy type
    requiredDocuments: DocumentUpload[] = [];

    // Payment data
    paymentData = {
        method: 'credit-card',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        upiId: '',
        accountNumber: '',
        ifscCode: ''
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private policyService: PolicyService,
        private customerService: CustomerService
    ) { }

    ngOnInit(): void {
        this.policyId = this.route.snapshot.paramMap.get('id') || '';
        if (this.policyId) {
            this.loadPolicyDetails();
            this.loadCustomerData();
        }
    }

    loadPolicyDetails(): void {
        this.loading = true;
        this.policyService.getPolicyById(this.policyId).subscribe({
            next: (policy) => {
                this.policy = policy;
                this.setRequiredDocuments(policy.type);
                this.loading = false;
            },
            error: (error: any) => {
                console.error('Error loading policy details:', error);
                this.loading = false;
            }
        });
    }

    loadCustomerData(): void {
        this.customerService.getCustomerById(this.customerId).subscribe({
            next: (customer: any) => {
                if (customer) {
                    this.customerData = {
                        fullName: `${customer.firstName} ${customer.lastName}`,
                        email: customer.email,
                        phone: customer.phone,
                        address: customer.address || ''
                    };
                }
            },
            error: (error: any) => {
                console.error('Error loading customer data:', error);
            }
        });
    }

    setRequiredDocuments(policyType: string): void {
        const documentTypes: { [key: string]: DocumentUpload[] } = {
            'health': [
                { type: 'identity', label: 'ID Proof (Aadhar/PAN)', file: null, status: 'pending', required: true },
                { type: 'address', label: 'Address Proof', file: null, status: 'pending', required: true },
                { type: 'medical', label: 'Medical Records', file: null, status: 'pending', required: false }
            ],
            'life': [
                { type: 'identity', label: 'ID Proof (Aadhar/PAN)', file: null, status: 'pending', required: true },
                { type: 'address', label: 'Address Proof', file: null, status: 'pending', required: true },
                { type: 'income', label: 'Income Proof', file: null, status: 'pending', required: true }
            ],
            'vehicle': [
                { type: 'identity', label: 'ID Proof (Aadhar/PAN)', file: null, status: 'pending', required: true },
                { type: 'vehicle_rc', label: 'Vehicle RC', file: null, status: 'pending', required: true },
                { type: 'previous_insurance', label: 'Previous Insurance (if any)', file: null, status: 'pending', required: false }
            ],
            'home': [
                { type: 'identity', label: 'ID Proof (Aadhar/PAN)', file: null, status: 'pending', required: true },
                { type: 'property', label: 'Property Documents', file: null, status: 'pending', required: true },
                { type: 'address', label: 'Address Proof', file: null, status: 'pending', required: true }
            ],
            'travel': [
                { type: 'identity', label: 'ID Proof (Aadhar/PAN)', file: null, status: 'pending', required: true },
                { type: 'passport', label: 'Passport Copy', file: null, status: 'pending', required: true }
            ]
        };

        this.requiredDocuments = documentTypes[policyType.toLowerCase()] || documentTypes['health'];
    }

    onFileSelect(event: any, document: DocumentUpload): void {
        const file = event.target.files[0];
        if (file) {
            document.file = file;
            document.status = 'uploaded';
        }
    }

    removeDocument(document: DocumentUpload): void {
        document.file = null;
        document.status = 'pending';
    }

    onSubmit(): void {
        if (this.validateForm()) {
            // In real app, upload documents and process payment
            console.log('Purchase submitted:', {
                policy: this.policy,
                customer: this.customerData,
                documents: this.requiredDocuments,
                payment: this.paymentData
            });

            alert('Policy purchase successful! Documents are being reviewed.');
            this.router.navigate(['/customer/my-policies']);
        }
    }

    validateForm(): boolean {
        // Check required documents
        const missingDocs = this.requiredDocuments.filter(doc => doc.required && !doc.file);
        if (missingDocs.length > 0) {
            alert(`Please upload required documents: ${missingDocs.map(d => d.label).join(', ')}`);
            return false;
        }

        // Validate payment details
        if (this.paymentData.method === 'credit-card' || this.paymentData.method === 'debit-card') {
            if (!this.paymentData.cardNumber || !this.paymentData.cardName || !this.paymentData.expiryDate || !this.paymentData.cvv) {
                alert('Please fill in all card details');
                return false;
            }
        } else if (this.paymentData.method === 'upi') {
            if (!this.paymentData.upiId) {
                alert('Please enter UPI ID');
                return false;
            }
        } else if (this.paymentData.method === 'net-banking') {
            if (!this.paymentData.accountNumber || !this.paymentData.ifscCode) {
                alert('Please enter banking details');
                return false;
            }
        }

        return true;
    }
}
