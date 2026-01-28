import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Claim } from '../models/claims';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private apiUrl = 'http://localhost:3000';

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
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    });
  }

  updateClaimStatus(id: string, status: 'pending' | 'approved' | 'rejected', remarks?: string): Observable<Claim> {
    return this.http.patch<Claim>(`${this.apiUrl}/claims/${id}`, { status, remarks });
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  }
}
