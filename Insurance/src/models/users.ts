export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'customer' | 'agent';
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
}