import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Claims } from '../../../../models/claims';
import { ClaimService } from '../../../../services/claimservice';
import { CustomerService } from '../../../../services/customerservice';
import { AuthService } from '../../../../app/core/services/auth.service';

@Component({
  selector: 'app-track-claims',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TitleCasePipe],
  templateUrl: './track-claims.html'
})
export class TrackClaimsComponent implements OnInit {
  claims: Claims[] = [];
  loading = true;
  selectedFilter = 'all';
  statusOptions = ['all', 'pending', 'approved', 'rejected'];

  private auth = inject(AuthService);

  constructor(
    private claimService: ClaimService,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    this.loading = true;

    const userId = this.auth.user?.id;
    if (!userId) {
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        const customer = customers.find(c => c.userId === userId);
        if (!customer) {
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        this.claimService.getClaimsByCustomer(customer.id).subscribe({
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
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredClaims(): Claims[] {
    if (this.selectedFilter === 'all') return this.claims;
    return this.claims.filter(
      c => c.status.toLowerCase() === this.selectedFilter.toLowerCase()
    );
  }

  getStatusClass(status: string): string {
    const s = status.toLowerCase();
    if (s === 'approved') return 'bg-green-50 text-green-700';
    if (s === 'pending') return 'bg-yellow-50 text-yellow-700';
    if (s === 'rejected') return 'bg-red-50 text-red-700';
    return 'bg-slate-100 text-slate-600';
  }
}
