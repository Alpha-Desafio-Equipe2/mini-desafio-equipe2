import { seedDoctors } from "./seedDoctors.js";
import { seedMedicine } from "./seedMedicines.js";
import { seedUsers } from "./seedUsers.js";

export function runSeeds() {
  console.log("Running database seeds...");

  seedDoctors();
  seedMedicine();
  seedUsers();

  console.log("Database seeds finished");
}
