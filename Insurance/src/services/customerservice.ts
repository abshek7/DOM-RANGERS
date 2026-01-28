import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, switchMap } from 'rxjs';
import { User } from '../models/users';
import { Policy } from '../models/policies';
import { Claim } from '../models/claims';
import { DashboardStats } from '../models/dashboard';
import { Customer } from '../models/customers';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:3000';
  private customerSubject = new BehaviorSubject<Customer | null>(null);
  public customer$ = this.customerSubject.asObservable();

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/customers`);
  }

  getCustomerByUserId(userId: number): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/customers?userId=${userId}`);
  }

  getCustomerById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/customers/${id}`);
  }

  updateCustomer(id: string, data: Partial<Customer>): Observable<Customer> {
    return this.http.patch<Customer>(`${this.apiUrl}/customers/${id}`, data);
  }

  updateCustomerDetail(id: string, data: Partial<Customer>): Observable<Customer> {
    return this.updateCustomer(id, data);
  }

  updateUser(id: number, data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}`, data);
  }

  getPolicies(): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${this.apiUrl}/policies`);
  }

  getClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.apiUrl}/claims`);
  }

  getDashboardStats(customerId: string): Observable<DashboardStats> {
    return this.http.get<Customer>(`${this.apiUrl}/customers/${customerId}`).pipe(
      switchMap((customer: Customer) => {
        return this.http.get<Claim[]>(`${this.apiUrl}/claims?customerId=${customerId}`).pipe(
          map((claims: Claim[]) => {
            const totalPolicies = customer.policies?.length || 0;
            const pendingClaimsCount = claims.filter((c: Claim) => c.status === 'pending').length;

            const recentActivity: any[] = [];
            customer.policies?.slice(-2).forEach((p: any) => {
              recentActivity.push({
                id: p.policyId,
                type: 'policy',
                title: 'Policy Added',
                description: `${p.policyName} (${p.status})`,
                date: p.renewalDate,
                status: p.status
              });
            });

            claims.slice(-2).forEach((c: Claim) => {
              recentActivity.push({
                id: c.id,
                type: 'claim',
                title: 'Claim Filed',
                description: `${c.type} Claim - ₹${c.amount}`,
                date: c.date,
                status: c.status
              });
            });

            return {
              totalPolicies,
              pendingClaims: pendingClaimsCount,
              recentActivity: recentActivity.sort((a, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
            };
          })
        );
      })
    );
  }

  calculatePremium(policy: Policy, age: number, duration: number, frequency: string): number {
    let multiplier = 1.0;
    if (age > 45) multiplier += 0.2;
    if (age > 60) multiplier += 0.3;
    if (frequency === 'monthly') multiplier *= 1.05;
    if (frequency === 'quarterly') multiplier *= 1.02;
    return Math.round(policy.premium * multiplier * duration);
  }
}
