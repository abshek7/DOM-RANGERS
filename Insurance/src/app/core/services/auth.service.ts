import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
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

  private _user$ = new BehaviorSubject<AuthSession['user'] | null>(this.loadSession().user ?? null);
  user$ = this._user$.asObservable();

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

  /**
   * ✅ UPDATED LOGIN:
   * - fetch user by email/username ONLY
   * - hash entered password in frontend
   * - compare with stored hash in DB
   */
  login(identifier: string, password: string, rememberMe: boolean): Observable<AuthSession['user']> {
    const isEmail = identifier.includes('@');

    let params = new HttpParams();
    params = isEmail ? params.set('email', identifier) : params.set('username', identifier);

    return this.http.get<User[]>(`${this.baseUrl}/users`, { params }).pipe(
      switchMap((users) => {
        if (!users?.length) return throwError(() => new Error('Invalid credentials'));
        const user = users[0];

        return from(this.hashPassword(password)).pipe(
          switchMap((enteredHash) => {
            const stored = (user as any).password as string | undefined;

            // If old users have plain password stored, support it once and migrate to hash
            const looksHashed = typeof stored === 'string' && /^[a-f0-9]{64}$/i.test(stored);

            if (looksHashed) {
              if (stored !== enteredHash) return throwError(() => new Error('Invalid credentials'));
              return of(user);
            }

            // legacy plaintext compare (for existing records)
            if (stored !== password) return throwError(() => new Error('Invalid credentials'));

            // migrate plaintext -> hash (best-effort)
            if (user?.id != null) {
              return this.http.patch<User>(`${this.baseUrl}/users/${user.id}`, { password: enteredHash }).pipe(
                catchError(() => of(user)), // ignore migration failure
                map(() => user)
              );
            }
            return of(user);
          }),
          map((okUser) => {
            const safeUser = this.stripPassword(okUser);

            const token = this.createFakeJwt({
              sub: String(okUser.id ?? ''),
              role: okUser.role,
              email: okUser.email,
              username: okUser.username,
              exp: Math.floor(Date.now() / 1000) + (rememberMe ? 7 * 24 * 3600 : 2 * 3600),
            });

            this.saveSession({ token, user: safeUser }, rememberMe ? 'local' : 'session');
            this._user$.next(safeUser);
            return safeUser;
          })
        );
      }),
      catchError((err) => throwError(() => new Error(this.prettyError(err))))
    );
  }

  /**
   * ✅ UPDATED REGISTER:
   * - hash password in frontend
   * - store ONLY hash in DB (in the same 'password' field)
   */
  register(payload: Omit<User, 'id' | 'createdAt'> & { role: UserRole }, autoLogin = true): Observable<AuthSession['user']> {
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
              password: passwordHash,
            } as User;
            return this.http.post<User>(`${this.baseUrl}/users`, newUser);
          })
        );
      }),
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

  private async hashPassword(password: string): Promise<string> {
    // optional "pepper" (still visible in frontend, but avoids plain text)
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
    return 'Something went wrong. Please try again.';
  }
}
