import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  const_api='http://localhost:3000';  
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
  updateClaim(id:string, payload:any) {
  return this.http.patch(this.const_api + '/claims/' + id, payload);
}

addPolicy(policy:any) {
  return this.http.post(this.const_api + '/policies', policy);
}

deletePolicy(id:string) {
  return this.http.delete(this.const_api + '/policies/' + id);
}
updatePolicy(id:string, policy:any) {
  return this.http.patch(this.const_api + '/policies/' + id, policy);
}
updateAgent(id:string, payload:any) {
  return this.http.patch(this.const_api + '/agents/' + id, payload);
}


getCustomers() {
  return this.http.get<any[]>(this.const_api + '/customers');
}
updateCustomer(id:string, payload:any) {
  return this.http.patch(this.const_api + '/customers/' + id, payload);
}
getDocuments() {
  return this.http.get<any[]>(this.const_api + '/documents');
}

}