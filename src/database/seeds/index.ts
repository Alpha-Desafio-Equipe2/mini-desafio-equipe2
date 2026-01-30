import { seedDoctors } from "./seedDoctors.js";
import { seedMedicine } from "./seedMedicines.js";
import { seedUsers } from "./seedUsers.js";
import { seedBranches } from "./seedBranches.js";

export function runSeeds() {
  console.log("Running database seeds...");

  seedBranches();
  seedDoctors();
  seedMedicine();
  seedUsers();

  console.log("Database seeds finished");
}
