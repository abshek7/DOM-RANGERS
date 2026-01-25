import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<any[]>("https://insurance-1-ylo4.onrender.com/users");
  }

  getAgents() {
    return this.http.get<any[]>("https://insurance-1-ylo4.onrender.com/agents");
  }

  getPolicies() {
    return this.http.get<any[]>("https://insurance-1-ylo4.onrender.com/policies");
  }

  getClaims() {
    return this.http.get<any[]>("https://insurance-1-ylo4.onrender.com/claims");
  }

  getPendingClaims() {
    return this.http.get<any[]>("https://insurance-1-ylo4.onrender.com/claims");
  }

}
