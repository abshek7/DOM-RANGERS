import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../app/core/services/auth.service';
import { CustomerService } from '../../../../services/customerservice';
import { Customer } from '../../../../models/customers';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
})
export class ProfileComponent implements OnInit {
  customer: Customer | null = null;
  editableCustomer: any = null;

  loading = true;
  error = '';
  editMode = false;
  saving = false;

  constructor(
    private auth: AuthService,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const user = this.auth.user;

    if (!user || user.role !== 'customer') {
      this.error = 'Unauthorized access';
      this.loading = false;
      return;
    }

    this.customerService.getCustomerByUserId(user.id!).subscribe({
      next: (customers) => {
        if (customers.length) {
          this.customer = customers[0];
        } else {
          this.error = 'Customer profile not found';
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load profile';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  enableEdit(): void {
    this.editableCustomer = { ...this.customer };
    this.editMode = true;
  }

  cancelEdit(): void {
    this.editableCustomer = null;
    this.editMode = false;
  }

  saveChanges(): void {
    if (!this.customer || !this.editableCustomer) return;

    this.saving = true;

    const payload = {
      nominee: this.editableCustomer.nominee,
      address: this.editableCustomer.address,
      dateOfBirth: this.editableCustomer.dateOfBirth,
      aadharNumber: this.editableCustomer.aadharNumber,
      panNumber: this.editableCustomer.panNumber,
    };

    this.customerService.updateCustomer(this.customer.id, payload).subscribe({
      next: () => {
        this.customer = { ...this.customer!, ...payload };
        this.editMode = false;
        this.saving = false;
        this.cdr.detectChanges();
      },
      error: () => {
        alert('Failed to update profile');
        this.saving = false;
        this.cdr.detectChanges();
      },
    });
  }
}
