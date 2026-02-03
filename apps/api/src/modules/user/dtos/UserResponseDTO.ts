import { UserRole } from "../domain/enums/UserRole.js";

export interface UserResponseDTO {
  name: string;
  email: string;
  cpf: string;
  role: UserRole;
  balance: number;
}
