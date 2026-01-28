import { db } from '../../config/database.js';
import { CreateMedicineDTO } from './dtos/CreateMedicineDTO.js';
import { AppError } from '../../shared/errors/AppError.js';

type MedicineRow = {
  id: number;
  name: string;
  manufacturer: string | null;
  active_principle: string;
  requires_prescription: number;
  price: number;
  stock: number;
};

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

  static getAll() {
    const rows = db.prepare(`
    SELECT
      id,
      name,
      price,
      stock,
      requires_prescription
    FROM medicines
  `).all();

    return rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      price: row.price,
      stock: row.stock,
      requiresPrescription: Boolean(row.requires_prescription),
    }));
  }

  static getById(id: number) {
    const row = db.prepare(`
    SELECT
      id,
      name,
      manufacturer,
      active_principle,
      requires_prescription,
      price,
      stock
    FROM medicines
    WHERE id = ?
  `).get(id) as MedicineRow || undefined;

    if (!row) {
      throw new AppError('Medicine not found', 404);
    }

    return {
      id: row.id,
      name: row.name,
      manufacturer: row.manufacturer,
      activePrinciple: row.active_principle,
      requiresPrescription: Boolean(row.requires_prescription),
      price: row.price,
      stock: row.stock,
    };
  }

  static update(id: string, data: CreateMedicineDTO) {
    const stmt = db.prepare(`
      UPDATE medicines SET
        name = ?,
        manufacturer = ?,
        active_principle = ?,
        requires_prescription = ?,
        price = ?,
        stock = ?
      WHERE id = ?
    `);

    const result = stmt.run(
      data.name,
      data.manufacturer ?? null,
      data.active_principle,
      data.requires_prescription ? 1 : 0,
      data.price,
      data.stock,
      id
    );

    return {
      id,
      ...data,
    };
  }

  static delete(id: string) {
    const stmt = db.prepare(`
      DELETE FROM medicines WHERE id = ?
    `);

    const result = stmt.run(id);

    return result;
  }
}