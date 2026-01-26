import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';
import type {
  User,
  Policy,
  CustomerPolicy,
  Claim,
  Payment,
  Document,
  DashboardStats,
  ActivityItem,
  PolicyFilter,
  PurchaseWizardData
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:3000';
  private currentUserId = 'u102'; // Default customer ID for demo

  constructor(private http: HttpClient) { }

  // User Management
  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  getCurrentUser(): Observable<User> {
    return this.getUser(this.currentUserId);
  }

  updateUser(userData: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${this.currentUserId}`, userData);
  }

  // Policy Management
  getPolicies(): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${this.apiUrl}/policies`);
  }

  getAllPolicies(): Observable<Policy[]> {
    return this.getPolicies();
  }

  getPolicyById(id: string): Observable<Policy> {
    return this.http.get<Policy>(`${this.apiUrl}/policies/${id}`);
  }

  getCustomerPolicies(): Observable<CustomerPolicy[]> {
    return this.http.get<CustomerPolicy[]>(`${this.apiUrl}/customerPolicies?customerId=${this.currentUserId}`);
  }

  purchasePolicy(purchaseData: PurchaseWizardData): Observable<CustomerPolicy> {
    const newPolicy: Partial<CustomerPolicy> = {
      customerId: this.currentUserId,
      policyId: purchaseData.policyId,
      policyNumber: `POL-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + purchaseData.coverageDuration * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentStatus: 'Paid',
      status: 'Active',
      premiumPaid: purchaseData.calculatedPremium,
      nextPremiumDue: purchaseData.calculatedPremium,
      nextPremiumDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    return this.http.post<CustomerPolicy>(`${this.apiUrl}/customerPolicies`, newPolicy);
  }

  filterPolicies(policies: Policy[], filters: PolicyFilter): Policy[] {
    return policies.filter(policy => {
      if (filters.type && policy.type !== filters.type) return false;
      if (filters.minPremium && policy.premium < filters.minPremium) return false;
      if (filters.maxPremium && policy.premium > filters.maxPremium) return false;
      if (filters.minCoverage && policy.coverage < filters.minCoverage) return false;
      if (filters.maxCoverage && policy.coverage > filters.maxCoverage) return false;
      if (filters.rating && policy.rating < filters.rating) return false;
      if (filters.searchTerm && !policy.policyName.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
      return true;
    });
  }

  calculatePremium(policyId: string, age: number, duration: number): Observable<number> {
    return this.getPolicyById(policyId).pipe(
      map(policy => {
        const basePremium = policy.premium;
        const ageFactor = age > 40 ? 1.2 : age > 30 ? 1.1 : 1;
        const durationFactor = duration > 1 ? 0.9 : 1;
        return Math.round(basePremium * ageFactor * durationFactor);
      })
    );
  }

  // Claims Management
  getCustomerClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.apiUrl}/claims?customerId=${this.currentUserId}`);
  }

  fileClaim(claimData: Partial<Claim>): Observable<Claim> {
    const newClaim: Partial<Claim> = {
      ...claimData,
      customerId: this.currentUserId,
      claimId: `CLM-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: claimData.documents || [],
      timeline: [{
        status: 'Submitted',
        updatedBy: 'customer',
        date: new Date().toISOString()
      }]
    };

    return this.http.post<Claim>(`${this.apiUrl}/claims`, newClaim);
  }

  // Payment Management
  getCustomerPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments?customerId=${this.currentUserId}`);
  }

  processPayment(paymentData: Partial<Payment>): Observable<Payment> {
    const newPayment: Partial<Payment> = {
      ...paymentData,
      customerId: this.currentUserId,
      paymentId: `PAY-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      status: 'paid',
      date: new Date().toISOString(),
      transactionId: `TXN-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`
    };

    return this.http.post<Payment>(`${this.apiUrl}/payments`, newPayment);
  }

  // Document Management
  getCustomerDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/documents?customerId=${this.currentUserId}`);
  }

  uploadDocument(documentData: Partial<Document>): Observable<Document> {
    const newDoc: Partial<Document> = {
      ...documentData,
      customerId: this.currentUserId,
      uploadedDate: new Date().toISOString(),
      verified: false
    };

    return this.http.post<Document>(`${this.apiUrl}/documents`, newDoc);
  }

  // Dashboard Statistics
  getDashboardStats(): Observable<DashboardStats> {
    return new Observable(observer => {
      Promise.all([
        this.getCustomerPolicies().toPromise(),
        this.getCustomerClaims().toPromise(),
        this.getCustomerPayments().toPromise()
      ]).then(([policies, claims, payments]) => {
        const activePolicies = policies?.filter(p => p.status === 'Active').length || 0;
        const pendingClaims = claims?.filter(c => c.status === 'pending').length || 0;
        const totalDues = payments?.filter(p => p.status === 'pending')
          .reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

        const recentActivity: ActivityItem[] = [
          ...(policies || []).slice(-2).map(p => ({
            id: p.id,
            type: 'policy' as const,
            title: 'Policy Purchased',
            description: `Policy ${p.policyNumber} activated`,
            date: p.startDate,
            status: p.status
          })),
          ...(claims || []).slice(-2).map(c => ({
            id: c.id,
            type: 'claim' as const,
            title: 'Claim Filed',
            description: `Claim ${c.claimId} for ₹${c.claimAmount}`,
            date: c.createdAt,
            status: c.status
          })),
          ...(payments || []).slice(-1).map(p => ({
            id: p.id,
            type: 'payment' as const,
            title: 'Payment Made',
            description: `₹${p.amount} paid for ${p.policyNumber}`,
            date: p.date || '',
            status: p.status
          }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

        observer.next({
          activePolicies,
          pendingClaims,
          totalDues,
          recentActivity
        });
        observer.complete();
      });
    });
  }
}
