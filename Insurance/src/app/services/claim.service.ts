import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Claim } from '../../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getClaimsByCustomer(customerId: string): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.apiUrl}/claims?customerId=${customerId}`);
  }

  getClaimById(id: string): Observable<Claim> {
    return this.http.get<Claim>(`${this.apiUrl}/claims/${id}`);
  }

  fileClaim(claim: Omit<Claim, 'id'>): Observable<Claim> {
    return this.http.post<Claim>(`${this.apiUrl}/claims`, {
      ...claim,
      createdAt: new Date().toISOString().split('T')[0]
    });
  }

  updateClaimStatus(id: string, status: string, remarks?: string): Observable<Claim> {
    return this.http.patch<Claim>(`${this.apiUrl}/claims/${id}`, { status, remarks });
  }

  getClaimStats(customerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/claims?customerId=${customerId}`);
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'Submitted': 'bg-blue-100 text-blue-800',
      'Under Review': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }
}
