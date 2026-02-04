import { db } from '../../config/database.js';

export function seedCategories() {
  const count = db
    .prepare('SELECT COUNT(*) as total FROM categories')
    .get() as { total: number };

  if (count.total > 0) {
    console.log('✓ Categories already seeded');
    return;
  }

  const insert = db.prepare(`
    INSERT INTO categories (name, description, icon, created_at, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);

  const categories = [
    {
      name: 'Analgésicos e Antipiréticos',
      description: 'Medicamentos para alívio de dores e redução de febre',
      icon: '💊'
    },
    {
      name: 'Anti-inflamatórios',
      description: 'Medicamentos para combater inflamações',
      icon: '🔥'
    },
    {
      name: 'Antibióticos',
      description: 'Medicamentos para combater infecções bacterianas',
      icon: '🦠'
    },
    {
      name: 'Antiácidos e Digestivos',
      description: 'Medicamentos para problemas digestivos e azia',
      icon: '🫃'
    },
    {
      name: 'Antialérgicos',
      description: 'Medicamentos para alergias e reações alérgicas',
      icon: '🤧'
    },
    {
      name: 'Cardiovasculares',
      description: 'Medicamentos para coração e pressão arterial',
      icon: '❤️'
    },
    {
      name: 'Diabetes',
      description: 'Medicamentos para controle de diabetes',
      icon: '💉'
    },
    {
      name: 'Vitaminas e Suplementos',
      description: 'Vitaminas, minerais e suplementos alimentares',
      icon: '🌟'
    },
    {
      name: 'Antigripais e Xaropes',
      description: 'Medicamentos para gripes, resfriados e tosse',
      icon: '🤒'
    },
    {
      name: 'Dermatológicos',
      description: 'Medicamentos para pele e tratamentos tópicos',
      icon: '🧴'
    },
    {
      name: 'Oftalmológicos',
      description: 'Colírios e medicamentos para os olhos',
      icon: '👁️'
    },
    {
      name: 'Outros',
      description: 'Outros medicamentos e produtos farmacêuticos',
      icon: '📦'
    }
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insert.run(item.name, item.description, item.icon);
    }
  });

  insertMany(categories);
  console.log(`✓ ${categories.length} categories seeded successfully`);
}