import { seedCategories } from "./seedCategories.js";
import { seedDoctors } from "./seedDoctors.js";
import { seedMedicines } from "./seedMedicines.js";
import { seedUsers } from "./seedUsers.js";
import { seedCustomers } from "./seedCustomer.js";

/**
 * Executa todos os seeds do banco de dados
 * Ordem de execução é importante devido às foreign keys
 */
export function runSeeds() {
  console.log("========================================");
  console.log("Starting database seeding...");
  console.log("========================================");

  try {
    // 1. Seeds independentes (sem foreign keys)
    seedCategories(); // NOVO: Deve vir antes de medicines
    seedDoctors();
    seedUsers();

    // 2. Seeds dependentes
    seedMedicines(); // Depende de categories
    seedCustomers(); // Depende de users

    console.log("========================================");
    console.log("✓ Database seeding completed successfully!");
    console.log("========================================");
  } catch (error) {
    console.error("========================================");
    console.error("✗ Error during database seeding:");
    console.error(error);
    console.error("========================================");
    throw error;
  }
}