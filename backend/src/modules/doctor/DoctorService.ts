import { db } from '../../config/database.js';
import { CreateDoctorDTO } from './dtos/CreateDoctorDTO.js';

export class DoctorService {
  static create(data: CreateDoctorDTO) {
    const stmt = db.prepare(`
      INSERT INTO doctors (
        name,
        crm,
        specialty
      )
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(
      data.name,
      data.crm,
      data.specialty
    );

    return {
      id: result.lastInsertRowid,
      ...data,
    };
  }
}