export type UserRole = 'admin' | 'customer' | 'agent';

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string; // YYYY-MM-DD
}

export interface AuthSession {
  token: string;
  user: Omit<User, 'password'>;
}

export interface AuthSession {
  user: User;
  token: string;
}
