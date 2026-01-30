import { UserRole } from "../domain/enums/UserRole.js";

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
