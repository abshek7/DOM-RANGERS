import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payments';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getPaymentsByCustomer(customerId: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments?customerId=${customerId}`);
  }

  getPaymentsByPolicy(policyId: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments?policyId=${policyId}`);
  }

  createPayment(payment: Omit<Payment, 'id'>): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/payments`, {
      ...payment,
      paymentDate: new Date().toISOString().split('T')[0]
    });
  }

  updatePaymentStatus(id: string, status: string): Observable<Payment> {
    return this.http.patch<Payment>(`${this.apiUrl}/payments/${id}`, { status });
  }

  getPaymentStats(customerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/payments?customerId=${customerId}`);
  }

  getUpcomingDues(customerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/customerPolicies?customerId=${customerId}`);
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'Success': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Overdue': 'bg-red-100 text-red-800',
      'Failed': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }
}
