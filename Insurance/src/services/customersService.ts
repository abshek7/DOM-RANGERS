import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../models/customers';
import { User } from '../models/users';
import { forkJoin } from 'rxjs';
import { AdminService } from './adminservice';
import { AuthService } from '../app/core/services/auth.service';
const API_URL = 'https://localhost:3000';

export interface CustomerWithUser {
  customer: Customer;
  user: User | undefined;
}

@Injectable({ providedIn: 'root' })
export class CustomersService {
  customers = signal<CustomerWithUser[]>([]);
  isLoading = signal(false);

  constructor(private http: HttpClient,private adminService: AdminService, private auth: AuthService) {}

  getCustomerById(id: string) {
    return this.customers().find((c) => c.customer.id === id)?.customer;
  }
  getCustomerByUserId(userId: number) {
  return this.http.get<any[]>(`${API_URL}/customers?userId=${userId}`);
}

updateCustomer(customerId: string, payload: any) {
  return this.http.patch(`${API_URL}/customers/${customerId}`, payload);
}

  loadCustomerById(id: string) {
    this.http.get<Customer>(`${API_URL}/customers/${id}`).subscribe((customer) => {
      this.customers.update((list) =>
        list.map((item) => (item.customer.id === id ? { ...item, customer } : item))
      );
    });
  }

  loadCustomers() {
  this.isLoading.set(true);

  forkJoin({
    customers: this.adminService.getCustomers(),
    users: this.adminService.getUsers(),
    agents: this.adminService.getAgents(),
  }).subscribe({
    next: ({ customers, users, agents }) => {
      const agent = agents.find(a => a.userId === this.auth.user?.id);
      const agentId = agent?.id;

      const filteredCustomers = agentId
        ? customers.filter((customer: any) =>
            customer.policies?.some(
              (policy:any) => policy.assignedAgentId === agentId
            )
          )
        : [];

      const merged = filteredCustomers.map(customer => ({
        customer,
        user: users.find(u => u.id === customer.userId),
      }));
      console.log('Loaded Customers for Agent:', agentId, merged);
      this.customers.set(merged);
      this.isLoading.set(false);
    },
    error: () => {
      this.customers.set([]);
      this.isLoading.set(false);
    },
  });
}
}