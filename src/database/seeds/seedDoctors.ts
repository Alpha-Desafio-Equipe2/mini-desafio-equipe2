import { db } from '../../config/database';

export function seedDoctors() {
  const count = db
    .prepare('SELECT COUNT(*) as total FROM doctors')
    .get() as { total: number };

  if (count.total > 0) {
    console.log('Doctors already seeded');
    return;
  }

  const insert = db.prepare(`
    INSERT INTO doctors (name, crm, specialty)
    VALUES (?, ?, ?)
  `);

  const doctors = [
    { name: 'Dra. Ana Paula', crm: 'CRM12345', specialty: 'Clínico Geral' },
    { name: 'Dr. João Silva', crm: 'CRM67890', specialty: 'Cardiologia' },
    { name: 'Dra. Mariana Costa', crm: 'CRM11223', specialty: 'Pediatria' }
  ];

  const insertMany = db.transaction((docs) => {
    for (const d of docs) {
      insert.run(d.name, d.crm, d.specialty);
    }
  });

  insertMany(doctors);

  console.log('Doctors seeded successfully');
}
