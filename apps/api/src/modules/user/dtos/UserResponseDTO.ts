import { UserRole } from "../domain/enums/UserRole.js";

export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  address: string;
  role: UserRole;
  balance: number;
}

