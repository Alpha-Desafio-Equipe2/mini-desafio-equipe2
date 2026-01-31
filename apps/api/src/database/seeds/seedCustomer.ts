import { db } from '../../config/database.js';

export function seedCustomers() {
  const count = db
    .prepare('SELECT COUNT(*) as total FROM customers')
    .get() as { total: number };

  if (count.total > 1) {
    console.log('Customers already seeded');
    return;
  }

  const insert = db.prepare(`
    INSERT INTO customers (name, cpf, created_at, updated_at, email)
    VALUES (?, ?, ?, ?, ?)
  `);

  const customers = [
    { name: 'Ana', cpf: '123.456.789-00', email: 'ana.paula@example.com' },
    { name: 'João', cpf: '987.654.321-00', email: 'joao.silva@example.com' },
    { name: 'Mariana', cpf: '456.789.123-00', email: 'mariana.costa@example.com' }
  ];

  const insertMany = db.transaction((docs) => {
    for (const d of docs) {
      insert.run(d.name, d.cpf, Date.now(), Date.now(), d.email);
    }
  });

  insertMany(customers);

  console.log('Customers seeded successfully');
}
