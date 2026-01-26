export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Customer' | 'Agent';
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  createdAt?: string;
  lastLogin?: string;
}
