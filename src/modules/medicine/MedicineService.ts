import { db } from '../../config/database.js';
import { CreateMedicineDTO } from './dtos/CreateMedicineDTO.js';

export class MedicineService {
  static create(data: CreateMedicineDTO) {
    const stmt = db.prepare(`
      INSERT INTO medicines (
        name,
        manufacturer,
        active_principle,
        requires_prescription,
        price,
        stock
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.name,
      data.manufacturer ?? null,
      data.active_principle,
      data.requires_prescription ? 1 : 0,
      data.price,
      data.stock
    );

    return {
      id: result.lastInsertRowid,
      ...data,
    };
  }
}
