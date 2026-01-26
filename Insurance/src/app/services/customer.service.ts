import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { CustomerPolicy, User } from '../../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = environment.apiUrl;
  private customerSubject = new BehaviorSubject<User | null>(null);
  public customer$ = this.customerSubject.asObservable();

  constructor(private http: HttpClient) { }

  getCustomer(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  // Get customer with full details including policies
  getCustomerById(customerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/customers/${customerId}`);
  }

  updateCustomer(id: string, data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}`, data);
  }

  getCustomerPolicies(customerId: string): Observable<CustomerPolicy[]> {
    return this.http.get<CustomerPolicy[]>(`${this.apiUrl}/customerPolicies?customerId=${customerId}`);
  }

  purchasePolicy(customerPolicy: Omit<CustomerPolicy, 'id'>): Observable<CustomerPolicy> {
    return this.http.post<CustomerPolicy>(`${this.apiUrl}/customerPolicies`, customerPolicy);
  }

  getPolicyStats(customerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/customerPolicies?customerId=${customerId}`);
  }

  setCurrentCustomer(customer: User): void {
    this.customerSubject.next(customer);
  }

  getCurrentCustomer(): User | null {
    return this.customerSubject.value;
  }
}
