import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Agent } from '../../../models/agents';
import { Customer } from '../../../models/customers';
import { AdminService } from '../../../services/adminservice';
import {
  BehaviorSubject,
  catchError,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { API_BASE_URL } from '../tokens/api-base-url.token';
import { AuthSession, User, UserRole } from '../../../models/users';

type StorageType = 'local' | 'session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = inject(API_BASE_URL);
  private AdminService = inject(AdminService);
  private _user$ = new BehaviorSubject<AuthSession['user'] | null>(this.loadSession().user ?? null);
  user$ = this._user$.asObservable();
  users:any = this.AdminService.getUsers().subscribe((data: any) => {});
  agents: any = this.AdminService.getAgents().subscribe((data: any) => {});
  customers: any = this.AdminService.getCustomers().subscribe((data: any) => {});
  
  get user(): AuthSession['user'] | null {
    return this._user$.value;
  }

  get role(): UserRole | null {
    return this.user?.role ?? null;
  }

  get token(): string | null {
    return this.loadSession().token ?? null;
  }

  // ---------- Public API ----------

  login(identifier: string, password: string, rememberMe: boolean) {
  if (!password || password.length < 6) {
    return throwError(() => new Error('Invalid credentials'));
  }

  const isEmail = identifier.includes('@');
  let params = new HttpParams();
  params = isEmail ? params.set('email', identifier) : params.set('username', identifier);

  return this.http.get<User[]>(`${this.baseUrl}/users`, { params }).pipe(
    switchMap(users => {
      if (!users?.length)
        return throwError(() => new Error('Invalid credentials'));

      const user = users[0];
      return from(this.hashPassword(password)).pipe(
        map(hash => {
          if (user.password !== hash)
            throw new Error('Invalid credentials');

          const safeUser = this.stripPassword(user);
          const token = this.createFakeJwt({
            sub: String(user.id),
            role: user.role,
            email: user.email,
            username: user.username,
            exp: Math.floor(Date.now() / 1000) + (rememberMe ? 7 * 24 * 3600 : 2 * 3600),
          });

          this.saveSession({ token, user: safeUser }, rememberMe ? 'local' : 'session');
          this._user$.next(safeUser);
          return safeUser;
        })
      );
    }),
    catchError(err => throwError(() => new Error(this.prettyError(err))))
  );
}


  /**
   * ✅ UPDATED REGISTER:
   * - hash password in frontend
   * - POST to /users
   * - ALSO POST to /agents or /customers (without password)
   */
  register(
    payload: Omit<User, 'createdAt'> & { role: UserRole },
    autoLogin = true
  ): Observable<AuthSession['user']> {
    const createdAt = new Date().toISOString().slice(0, 10);

    if (payload.role === 'admin') {
      return throwError(() => new Error('Admin registration is not allowed.'));
    }
   
    const checkEmail$ = this.http.get<User[]>(`${this.baseUrl}/users`, {
      params: new HttpParams().set('email', payload.email),
    });
    const checkUsername$ = this.http.get<User[]>(`${this.baseUrl}/users`, {
      params: new HttpParams().set('username', payload.username),
    });
    return forkJoin({ byEmail: checkEmail$, byUsername: checkUsername$ }).pipe(
      switchMap(({ byEmail, byUsername }) => {
        if (byEmail?.length) return throwError(() => new Error('Email already exists.'));
        if (byUsername?.length) return throwError(() => new Error('Username already exists.'));
        return from(this.hashPassword((payload as any).password)).pipe(
          switchMap((passwordHash) => {
            const newUser: User = {
              ...payload,
              createdAt,
              password: passwordHash, // ✅ hashed stored in users
            } as User;
            return this.http.post<User>(`${this.baseUrl}/users`, newUser);
          })
        );
      }),

      // 3) also create in /agents or /customers (no password there)
      switchMap((createdUser) =>
        this.createRoleProfile(createdUser).pipe(
          map(() => createdUser),
          catchError((err) => {
            // optional rollback: if role insert fails, delete created /users record
            if (createdUser?.id != null) {
              return this.http.delete(`${this.baseUrl}/users/${createdUser.id}`).pipe(
                switchMap(() =>
                  throwError(() => new Error('Registration failed while creating role profile. Please try again.'))
                ),
                catchError(() =>
                  throwError(() => new Error('User created but role profile failed. Please contact admin.'))
                )
              );
            }
            return throwError(() => err);
          })
        )
      ),

      // 4) auto-login same as before
      switchMap((createdUser) => {
        const safeUser = this.stripPassword(createdUser);
        if (!autoLogin) return of(safeUser);
        const token = this.createFakeJwt({
          sub: String(createdUser.id ?? ''),
          role: createdUser.role,
          email: createdUser.email,
          username: createdUser.username,
          exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
        });

        this.saveSession({ token, user: safeUser }, 'local');
        this._user$.next(safeUser);
        return of(safeUser);
      }),

      catchError((err) => throwError(() => new Error(this.prettyError(err))))
    );
  }

  logout(): void {
    localStorage.removeItem('insurance_auth');
    sessionStorage.removeItem('insurance_auth');
    this._user$.next(null);
  }

  isAuthenticated(): boolean {
    const s = this.loadSession();
    if (!s.token || !s.user) return false;

    const payload = this.decodeFakeJwt(s.token);
    const exp = payload?.exp;
    if (!exp) return true;
    return Math.floor(Date.now() / 1000) < exp;
  }

private createRoleProfile(createdUser: User): Observable<any> {
  if (createdUser.role === 'agent') {
    const agent: Agent = {
      id: `AGT-${Date.now()}`,
      userId: createdUser.id!,
      licenseNumber: `LIC-${Math.floor(100000 + Math.random() * 900000)}`,
      commissionRate: 10,
      assignedCustomers: [],
      totalPoliciesSold: 0,
      sales: [],
      commissions: [],
      communicationLogs: [],
    };

    return this.http.post(`${this.baseUrl}/agents`, agent);
  }
  console.log(this.customers)
  const customer: Customer = {
    id: `CUST-${Date.now()}`,
    userId: createdUser.id!,
    nominee: '',
    address: '',
    dateOfBirth: '',
    aadharNumber: '',
    panNumber: '',
    assignedAgent: {
      agentId: '',
      name: '',
      commissionRate: 0,
    },
    policies: [],
    claims: [],
  };

  return this.http.post(`${this.baseUrl}/customers`, customer);
}

  
  private async hashPassword(password: string): Promise<string> {
    const PEPPER = 'INSURANCE_PORTAL_DEMO';
    const input = `${password}::${PEPPER}`;

    if (!globalThis.crypto?.subtle) {
      throw new Error('Password hashing is not supported in this browser/environment.');
    }

    const enc = new TextEncoder();
    const buf = await crypto.subtle.digest('SHA-256', enc.encode(input));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private stripPassword(u: User): AuthSession['user'] {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safe } = u as any;
    return safe;
  }

  private saveSession(session: AuthSession, type: StorageType): void {
    const key = 'insurance_auth';
    const val = JSON.stringify(session);
    if (type === 'local') localStorage.setItem(key, val);
    else sessionStorage.setItem(key, val);

    if (type === 'local') sessionStorage.removeItem(key);
    else localStorage.removeItem(key);
  }

  private loadSession(): Partial<AuthSession> {
    const key = 'insurance_auth';
    const raw = localStorage.getItem(key) ?? sessionStorage.getItem(key);
    if (!raw) return {};
    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      return {};
    }
  }

  private base64UrlEncode(obj: unknown): string {
    const json = JSON.stringify(obj);
    const utf8 = encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    );
    return btoa(utf8).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  private base64UrlDecode(str: string): string {
    const pad = str.length % 4 ? '='.repeat(4 - (str.length % 4)) : '';
    const b64 = (str + pad).replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64);
    const utf8 = Array.from(bin, (c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    return decodeURIComponent(utf8);
  }

  private createFakeJwt(payload: any): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const h = this.base64UrlEncode(header);
    const p = this.base64UrlEncode(payload);
    const sig = 'signature';
    return `${h}.${p}.${sig}`;
  }

  private decodeFakeJwt(token: string): any | null {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      return JSON.parse(this.base64UrlDecode(parts[1]));
    } catch {
      return null;
    }
  }

  private prettyError(err: any): string {
    if (err?.message) return err.message;
    // helpful message for missing routes
    if (err?.status === 404) return 'API route not found. Ensure /agents and /customers exist in backend.';
    return 'Something went wrong. Please try again.';
  }
}
