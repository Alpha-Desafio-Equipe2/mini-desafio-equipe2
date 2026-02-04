import { UserRole } from "../domain/enums/UserRole.js";

export interface User {
  id: number;
  name: string;
  cpf: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  role: UserRole;
  balance?: number;
  created_at?: string;
  updated_at?: string;
}
