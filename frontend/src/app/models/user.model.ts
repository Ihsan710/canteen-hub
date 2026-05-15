export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Teacher' | 'Admin';
  department?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
