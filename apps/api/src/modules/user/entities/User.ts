import { UserRole } from "../domain/enums/UserRole.js";

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}
