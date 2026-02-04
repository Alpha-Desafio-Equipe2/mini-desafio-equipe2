import { MedicineRepository } from "../repositories/MedicineRepository.js";

interface FindMedicinesFilters {
  category_id?: number;
  requires_prescription?: boolean;
  search?: string;
  min_price?: number;
  max_price?: number;
}

export class FindAllMedicinesUseCase {
  async execute(filters?: FindMedicinesFilters) {
    if (filters && Object.keys(filters).length > 0) {
      return MedicineRepository.findWithFilters(filters);
    }
    
    return MedicineRepository.findAll();
  }
}