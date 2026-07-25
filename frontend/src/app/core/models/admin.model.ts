export interface Admin {
  id: string;
  email: string;
  nombre: string;
  role: 'ADMIN';
}

export interface LoginResponse {
  accessToken: string;
  admin: Admin;
}
