import { seedDoctors } from "./seedDoctors.js";
import { seedMedicine } from "./seedMedicines.js";
import { seedUsers } from "./seedUsers.js";
import { seedCustomers } from "./seedCustomer.js";

export function runSeeds() {
  seedDoctors();
  seedMedicine();
  seedUsers();
  seedCustomers();
}
