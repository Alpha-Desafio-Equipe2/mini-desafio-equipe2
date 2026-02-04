import { seedMedicine } from "./seedMedicines.js";
import { seedUsers } from "./seedUsers.js";

export function runSeeds() {
  seedMedicine();
  seedUsers();
}
