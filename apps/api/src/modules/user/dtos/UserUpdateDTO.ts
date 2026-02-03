import { UserRole } from "../domain/enums/UserRole.js";

export interface UserUpdateDTO {
  name?: string;
  cpf?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  balance?: number;
}
