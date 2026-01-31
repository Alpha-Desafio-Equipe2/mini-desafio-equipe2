import { MedicineRepository } from "../repositories/MedicineRepository.js";

export class FindAllMedicinesUseCase {
  async execute() {
    return MedicineRepository.findAll();
  }
}
