import { UserRepository } from "../repositories/UserRepository.js";

export class FindAllUsersUseCase {
  execute() {
    return UserRepository.findAll();
  }
}
