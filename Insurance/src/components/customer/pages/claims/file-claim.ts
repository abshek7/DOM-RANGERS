import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../../../services/customerservice';
import { ClaimService } from '../../../../services/claimservice';
import { Customer } from '../../../../models/customers';
import { AuthService } from '../../../../app/core/services/auth.service';

@Component({
  selector: 'app-file-claim',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './file-claim.html'
})
export class FileClaimComponent implements OnInit {
  customer: Customer | null = null;
  loading = true;
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

  private auth = inject(AuthService);

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

    const userId = this.auth.user?.id;
    if (!userId) {
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.customer = customers.find(c => c.userId === userId) || null;
        this.activePolicies = this.customer?.policies || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onPolicyChange(): void {
    const selectedPolicy = this.activePolicies.find(p => p.policyId === this.formData.policyId);
    if (selectedPolicy) {
      // Auto-fill type based on policy type (simple matching)
      if (selectedPolicy.policyName.toLowerCase().includes('health')) this.formData.type = 'Health';
      else if (selectedPolicy.policyName.toLowerCase().includes('life')) this.formData.type = 'Life';
      else if (selectedPolicy.policyName.toLowerCase().includes('vehicle') || selectedPolicy.policyName.toLowerCase().includes('motor')) this.formData.type = 'Vehicle';
      else if (selectedPolicy.policyName.toLowerCase().includes('travel')) this.formData.type = 'Travel';
      else if (selectedPolicy.policyName.toLowerCase().includes('home')) this.formData.type = 'Home';

      // Reset amount validation if needed
    }
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (!files) return;

    this.selectedFiles = Array.from(files).map((f: any) => f.name);
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if (!this.customer || !this.formData.policyId || !this.formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    const selectedPolicy = this.activePolicies.find(p => p.policyId === this.formData.policyId);
    if (selectedPolicy && this.formData.amount > selectedPolicy.coverage) {
      alert(`Claim amount (₹${this.formData.amount}) cannot exceed policy coverage (₹${selectedPolicy.coverage})`);
      return;
    }

    const newClaim: any = {
      id: `CLM-${Date.now()}`,
      customerId: this.customer.id,
      policyId: this.formData.policyId,
      type: this.formData.type,
      amount: this.formData.amount,
      date: this.formData.date,
      description: this.formData.description,
      documents: this.selectedFiles,
      assignedAgent: {
        agentId: this.customer.assignedAgent.agentId,
        name: this.customer.assignedAgent.name,
        commissionRate: this.customer.assignedAgent.commissionRate
      }
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
