import { db } from '../../config/database.js';

export function seedMedicines() {
  const count = db
    .prepare('SELECT COUNT(*) as total FROM medicines')
    .get() as { total: number };

  if (count.total > 0) {
    console.log('✓ Medicines already seeded');
    return;
  }

  // Buscar IDs das categorias
  const categories = db.prepare('SELECT id, name FROM categories').all() as Array<{ id: number; name: string }>;
  const categoryMap = new Map(categories.map(c => [c.name, c.id]));

  const insert = db.prepare(`
    INSERT INTO medicines (
      name, 
      manufacturer, 
      active_principle, 
      requires_prescription, 
      price, 
      stock,
      image_url,
      category_id,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);

  const medicines = [
    // ANALGÉSICOS E ANTIPIRÉTICOS (Venda Livre)
    { 
      name: 'Paracetamol 500mg', 
      manufacturer: 'EMS',
      active_principle: 'Paracetamol', 
      requires_prescription: 0, 
      price: 8.90, 
      stock: 150,
      image_url: null,
      category: 'Analgésicos e Antipiréticos'
    },
    { 
      name: 'Dipirona Sódica 500mg', 
      manufacturer: 'Medley',
      active_principle: 'Dipirona Sódica', 
      requires_prescription: 0, 
      price: 6.50, 
      stock: 200,
      image_url: null,
      category: 'Analgésicos e Antipiréticos'
    },
    { 
      name: 'Ibuprofeno 600mg', 
      manufacturer: 'Aché',
      active_principle: 'Ibuprofeno', 
      requires_prescription: 0, 
      price: 12.90, 
      stock: 120,
      image_url: null,
      category: 'Analgésicos e Antipiréticos'
    },
    { 
      name: 'AAS 100mg', 
      manufacturer: 'Bayer',
      active_principle: 'Ácido Acetilsalicílico', 
      requires_prescription: 0, 
      price: 9.80, 
      stock: 100,
      image_url: null,
      category: 'Analgésicos e Antipiréticos'
    },

    // ANTI-INFLAMATÓRIOS (Alguns com prescrição)
    { 
      name: 'Nimesulida 100mg', 
      manufacturer: 'Medley',
      active_principle: 'Nimesulida', 
      requires_prescription: 1, 
      price: 18.50, 
      stock: 80,
      image_url: null,
      category: 'Anti-inflamatórios'
    },
    { 
      name: 'Diclofenaco Sódico 50mg', 
      manufacturer: 'Eurofarma',
      active_principle: 'Diclofenaco Sódico', 
      requires_prescription: 1, 
      price: 15.90, 
      stock: 90,
      image_url: null,
      category: 'Anti-inflamatórios'
    },

    // ANTIBIÓTICOS (Prescrição Obrigatória)
    { 
      name: 'Amoxicilina 500mg', 
      manufacturer: 'Neo Química',
      active_principle: 'Amoxicilina', 
      requires_prescription: 1, 
      price: 24.90, 
      stock: 60,
      image_url: null,
      category: 'Antibióticos'
    },
    { 
      name: 'Azitromicina 500mg', 
      manufacturer: 'EMS',
      active_principle: 'Azitromicina', 
      requires_prescription: 1, 
      price: 32.50, 
      stock: 50,
      image_url: null,
      category: 'Antibióticos'
    },
    { 
      name: 'Cefalexina 500mg', 
      manufacturer: 'Medley',
      active_principle: 'Cefalexina', 
      requires_prescription: 1, 
      price: 28.90, 
      stock: 45,
      image_url: null,
      category: 'Antibióticos'
    },

    // ANTIÁCIDOS E DIGESTIVOS (Venda Livre)
    { 
      name: 'Omeprazol 20mg', 
      manufacturer: 'EMS',
      active_principle: 'Omeprazol', 
      requires_prescription: 0, 
      price: 14.90, 
      stock: 110,
      image_url: null,
      category: 'Antiácidos e Digestivos'
    },
    { 
      name: 'Pantoprazol 40mg', 
      manufacturer: 'Aché',
      active_principle: 'Pantoprazol', 
      requires_prescription: 0, 
      price: 22.50, 
      stock: 85,
      image_url: null,
      category: 'Antiácidos e Digestivos'
    },
    { 
      name: 'Mylanta Plus', 
      manufacturer: 'Johnson & Johnson',
      active_principle: 'Hidróxido de Alumínio + Hidróxido de Magnésio', 
      requires_prescription: 0, 
      price: 16.90, 
      stock: 70,
      image_url: null,
      category: 'Antiácidos e Digestivos'
    },

    // ANTIALÉRGICOS (Venda Livre)
    { 
      name: 'Loratadina 10mg', 
      manufacturer: 'EMS',
      active_principle: 'Loratadina', 
      requires_prescription: 0, 
      price: 11.90, 
      stock: 95,
      image_url: null,
      category: 'Antialérgicos'
    },
    { 
      name: 'Allegra 120mg', 
      manufacturer: 'Sanofi',
      active_principle: 'Fexofenadina', 
      requires_prescription: 0, 
      price: 42.90, 
      stock: 55,
      image_url: null,
      category: 'Antialérgicos'
    },
    { 
      name: 'Antistax', 
      manufacturer: 'Boehringer',
      active_principle: 'Extrato de Folhas de Vitis Vinifera', 
      requires_prescription: 0, 
      price: 68.50, 
      stock: 30,
      image_url: null,
      category: 'Antialérgicos'
    },

    // CARDIOVASCULARES (Prescrição Obrigatória)
    { 
      name: 'Losartana Potássica 50mg', 
      manufacturer: 'EMS',
      active_principle: 'Losartana Potássica', 
      requires_prescription: 1, 
      price: 19.90, 
      stock: 75,
      image_url: null,
      category: 'Cardiovasculares'
    },
    { 
      name: 'Enalapril 20mg', 
      manufacturer: 'Medley',
      active_principle: 'Maleato de Enalapril', 
      requires_prescription: 1, 
      price: 15.50, 
      stock: 80,
      image_url: null,
      category: 'Cardiovasculares'
    },
    { 
      name: 'Sinvastatina 20mg', 
      manufacturer: 'EMS',
      active_principle: 'Sinvastatina', 
      requires_prescription: 1, 
      price: 18.90, 
      stock: 65,
      image_url: null,
      category: 'Cardiovasculares'
    },

    // DIABETES (Prescrição Obrigatória)
    { 
      name: 'Metformina 850mg', 
      manufacturer: 'Glenmark',
      active_principle: 'Cloridrato de Metformina', 
      requires_prescription: 1, 
      price: 12.90, 
      stock: 90,
      image_url: null,
      category: 'Diabetes'
    },
    { 
      name: 'Glibenclamida 5mg', 
      manufacturer: 'Nova Química',
      active_principle: 'Glibenclamida', 
      requires_prescription: 1, 
      price: 9.90, 
      stock: 70,
      image_url: null,
      category: 'Diabetes'
    },

    // VITAMINAS E SUPLEMENTOS (Venda Livre)
    { 
      name: 'Centrum', 
      manufacturer: 'Pfizer',
      active_principle: 'Polivitamínico', 
      requires_prescription: 0, 
      price: 54.90, 
      stock: 40,
      image_url: null,
      category: 'Vitaminas e Suplementos'
    },
    { 
      name: 'Vitamina C 1g', 
      manufacturer: 'Aché',
      active_principle: 'Ácido Ascórbico', 
      requires_prescription: 0, 
      price: 18.90, 
      stock: 100,
      image_url: null,
      category: 'Vitaminas e Suplementos'
    },
    { 
      name: 'Vitamina D3 2000UI', 
      manufacturer: 'Vitamed',
      active_principle: 'Colecalciferol', 
      requires_prescription: 0, 
      price: 28.90, 
      stock: 60,
      image_url: null,
      category: 'Vitaminas e Suplementos'
    },

    // XAROPES E ANTIGRIPAIS (Venda Livre)
    { 
      name: 'Vick VapoRub', 
      manufacturer: 'Procter & Gamble',
      active_principle: 'Cânfora + Mentol + Eucalipto', 
      requires_prescription: 0, 
      price: 24.90, 
      stock: 50,
      image_url: null,
      category: 'Antigripais e Xaropes'
    },
    { 
      name: 'Benegrip Multi', 
      manufacturer: 'Hypera',
      active_principle: 'Paracetamol + Fenilefrina + Carbinoxamina', 
      requires_prescription: 0, 
      price: 16.90, 
      stock: 85,
      image_url: null,
      category: 'Antigripais e Xaropes'
    },
    { 
      name: 'Xarope Vick 44', 
      manufacturer: 'Procter & Gamble',
      active_principle: 'Dextrometorfano', 
      requires_prescription: 0, 
      price: 22.50, 
      stock: 45,
      image_url: null,
      category: 'Antigripais e Xaropes'
    },

    // DERMATOLÓGICOS (Alguns com prescrição)
    { 
      name: 'Bepantol Derma', 
      manufacturer: 'Bayer',
      active_principle: 'Dexpantenol', 
      requires_prescription: 0, 
      price: 34.90, 
      stock: 55,
      image_url: null,
      category: 'Dermatológicos'
    },
    { 
      name: 'Cetoconazol Creme 2%', 
      manufacturer: 'EMS',
      active_principle: 'Cetoconazol', 
      requires_prescription: 1, 
      price: 18.90, 
      stock: 40,
      image_url: null,
      category: 'Dermatológicos'
    },

    // OFTALMOLÓGICOS (Prescrição recomendada)
    { 
      name: 'Colírio Systane', 
      manufacturer: 'Alcon',
      active_principle: 'Propilenoglicol + Polietilenoglicol', 
      requires_prescription: 0, 
      price: 42.90, 
      stock: 35,
      image_url: null,
      category: 'Oftalmológicos'
    },
    { 
      name: 'Maxidex', 
      manufacturer: 'Alcon',
      active_principle: 'Dexametasona', 
      requires_prescription: 1, 
      price: 38.50, 
      stock: 25,
      image_url: null,
      category: 'Oftalmológicos'
    }
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      const categoryId = categoryMap.get(item.category) || null;
      insert.run(
        item.name,
        item.manufacturer,
        item.active_principle,
        item.requires_prescription,
        item.price,
        item.stock,
        item.image_url,
        categoryId
      );
    }
  });

  insertMany(medicines);
  console.log(`✓ ${medicines.length} medicines seeded successfully`);
}