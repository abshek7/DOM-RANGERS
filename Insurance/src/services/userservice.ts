import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/users';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) { }

    getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/users/${id}`);
    }

    updateUser(id: number, user: Partial<User>): Observable<User> {
        return this.http.patch<User>(`${this.apiUrl}/users/${id}`, user);
    }
}
