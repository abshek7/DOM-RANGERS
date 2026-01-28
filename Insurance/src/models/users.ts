<<<<<<< HEAD
 export type UserRole = 'admin' | 'customer' | 'agent';
=======
export type UserRole = 'admin' | 'customer' | 'agent';
>>>>>>> d517592a8a6cc022f2d83ec9ca6d4d1b11855d92

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
