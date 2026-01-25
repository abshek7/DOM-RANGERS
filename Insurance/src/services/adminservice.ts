import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  const_api='https://insurance-1-ylo4.onrender.com';  
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<any[]>(this.const_api + "/users");
  }

  getAgents() {
    return this.http.get<any[]>(this.const_api + "/agents");
  }

  getPolicies() {
    return this.http.get<any[]>(this.const_api + "/policies");
  }

  getClaims() {
    return this.http.get<any[]>(this.const_api + "/claims");
  }

  getPendingClaims() {
    return this.http.get<any[]>(this.const_api + "/claims");
  }
  updateClaim(claim:any) {
  return this.http.put(this.const_api + '/claims/' + claim.id, claim);
}
addPolicy(policy:any) {
  return this.http.post(this.const_api + '/policies', policy);
}

deletePolicy(id:string) {
  return this.http.delete(this.const_api + '/policies/' + id);
}
getCustomers() {
  return this.http.get<any[]>(this.const_api + '/customers');
}


}
