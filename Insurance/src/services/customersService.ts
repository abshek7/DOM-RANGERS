import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../models/customers';
import { User } from '../models/users';
import { forkJoin } from 'rxjs';

const API_URL = 'https://insurance-1-ylo4.onrender.com';

export interface CustomerWithUser {
  customer: Customer;
  user: User | undefined;
}

@Injectable({ providedIn: 'root' })
export class CustomersService {

  customers = signal<CustomerWithUser[]>([]);
  isLoading = signal(false);

  constructor(private http: HttpClient) {}

  loadCustomers() {
    this.isLoading.set(true);

    forkJoin({
      customers: this.http.get<Customer[]>(`${API_URL}/customers`),
      users: this.http.get<User[]>(`${API_URL}/users`)
    }).subscribe({
      next: ({ customers, users }) => {

        const merged = customers.map(customer => ({
          customer,
          user: users.find(u => u.id === customer.userId)
        }));

        this.customers.set(merged);
        this.isLoading.set(false);
      },
      error: () => {
        this.customers.set([]);
        this.isLoading.set(false);
      }
    });
  }
}
