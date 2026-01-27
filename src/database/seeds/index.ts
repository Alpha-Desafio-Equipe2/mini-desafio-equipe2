import { seedDoctors } from './seedDoctors';
import { seedMedicine } from './seedMedicines';

export function runSeeds() {
  console.log('Running database seeds...');

  seedDoctors();
  seedMedicine();

  console.log('Database seeds finished');
}