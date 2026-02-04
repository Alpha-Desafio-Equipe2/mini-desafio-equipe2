import { CategoryRepository } from "../repositories/CategoryRepository.js";

export class FindAllCategoriesUseCase {
  async execute(includeCount: boolean = false) {
    if (includeCount) {
      return CategoryRepository.getCategoriesWithCount();
    }
    
    return CategoryRepository.findAll();
  }
}