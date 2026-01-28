import { db } from '../../config/database.js';
import { CreateMedicineDTO } from './dtos/CreateMedicineDTO.js';
import { AppError } from '../../shared/errors/AppError.js';
import { UpdateMedicineDTO } from './dtos/UpdateMedicineDTO.js';

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

  static update(id: string, data: UpdateMedicineDTO) {
    const medicine = db
      .prepare('SELECT * FROM medicines WHERE id = ?')
      .get(id) as MedicineRow | undefined;

    if (!medicine) {
      throw new AppError('Medicine not found', 404);
    }

    if (data.stock !== undefined && data.stock < 0) {
      throw new AppError('Stock cannot be negative', 400);
    }

    if (data.price !== undefined && data.price <= 0) {
      throw new AppError('Price must be greater than zero', 400);
    }

    const updated = {
      name: data.name ?? medicine.name,
      manufacturer: data.manufacturer ?? medicine.manufacturer,
      active_principle: data.active_principle ?? medicine.active_principle,
      requires_prescription:
        data.requires_prescription !== undefined
          ? (data.requires_prescription ? 1 : 0)
          : medicine.requires_prescription,
      price: data.price ?? medicine.price,
      stock: data.stock ?? medicine.stock,
    };

    db.prepare(`
    UPDATE medicines SET
      name = ?,
      manufacturer = ?,
      active_principle = ?,
      requires_prescription = ?,
      price = ?,
      stock = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
      updated.name,
      updated.manufacturer,
      updated.active_principle,
      updated.requires_prescription,
      updated.price,
      updated.stock,
      id
    );

    return { id, ...updated };
  }

  static delete(id: string) {
    const stmt = db.prepare(`
      DELETE FROM medicines WHERE id = ?
    `);

    const result = stmt.run(id);

    return result;
  }
}