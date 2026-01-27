import { db } from '../../config/database';

export function seedMedicine() {
  const count = db
    .prepare('SELECT COUNT(*) as total FROM medicines')
    .get() as { total: number };

  if (count.total > 0) {
    console.log('Medicine already seeded');
    return;
  }

  const insert = db.prepare(`
    INSERT INTO medicines (name, manufacturer, active_principle, requires_prescription, price, stock)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const medicines = [
    { name: 'Paracetamol', manufacturer: 'Farmacêutica ABC', active_principle: 'Paracetamol', requires_prescription: 0, price: 10.99, stock: 10 },
    { name: 'Aspirina', manufacturer: 'Farmacêutica DEF', active_principle: 'Aspirina', requires_prescription: 1, price: 20.99, stock: 20 },
    { name: 'Ibuprofeno', manufacturer: 'Farmacêutica GHI', active_principle: 'Ibuprofeno', requires_prescription: 0, price: 15.99, stock: 15 }
  ];

  const insertMany = db.transaction((docs) => {
    for (const d of docs) {
      insert.run(d.name, d.manufacturer, d.active_principle, d.requires_prescription, d.price, d.stock);
    }
  });

  insertMany(medicines);

  console.log('Medicine seeded successfully');
}
