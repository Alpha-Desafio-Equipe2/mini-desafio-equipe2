import { seedDoctors } from './seedDoctors.js';
import { seedMedicine } from './seedMedicines.js';

export function runSeeds() {
  console.log('Running database seeds...');

  seedDoctors();
  seedMedicine();

  console.log('Database seeds finished');
}