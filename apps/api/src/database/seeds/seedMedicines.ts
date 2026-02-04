import { db } from '../../config/database.js';

export function seedMedicine() {
  const count = db
    .prepare('SELECT COUNT(*) as total FROM medicines')
    .get() as { total: number };

  // Permite recriar o seed apenas se o banco estiver muito vazio
  // Isso evita que suas alterações manuais ou fotos novas sumam ao reiniciar
  if (count.total > 10) { 
    console.log('Medicine already seeded (Threshold > 10)');
    return;
  }

  // Desabilita as FKs temporariamente para limpar o banco
  db.prepare('PRAGMA foreign_keys = OFF').run();
  db.prepare('DELETE FROM medicines').run();
  db.prepare('PRAGMA foreign_keys = ON').run();

  const insert = db.prepare(`
    INSERT INTO medicines (name, manufacturer, category, active_principle, requires_prescription, price, stock, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const medicines = [
    // Remédios
    { name: 'Aspirina 400mg (10cp)', manufacturer: 'Bayer', category: 'Remédios', active_principle: 'Ácido Acetilsalicílico', requires_prescription: 0, price: 15.90, stock: 50, image_url: 'aspirina-400mg-10cp.webp' },
    { name: 'Dipirona 500mg (10cp)', manufacturer: 'Medley', category: 'Remédios', active_principle: 'Dipirona Monoidratada', requires_prescription: 0, price: 8.50, stock: 100, image_url: 'dipirona-500mg-10cp.webp' },
    { name: 'Ibuprofeno 400mg (8cp)', manufacturer: 'Eurofarma', category: 'Remédios', active_principle: 'Ibuprofeno', requires_prescription: 0, price: 12.00, stock: 80, image_url: 'ibrupofeno-400mg-8cp.webp' },
    { name: 'Paracetamol 750mg (20cp)', manufacturer: 'EMS', category: 'Remédios', active_principle: 'Paracetamol', requires_prescription: 0, price: 14.50, stock: 120, image_url: 'paracetamol-750ml-20cp.webp' },
    { name: 'Doricin', manufacturer: 'Sanofi', category: 'Remédios', active_principle: 'Associação', requires_prescription: 0, price: 11.20, stock: 60, image_url: 'doricin.webp' },
    { name: 'Nevralgex', manufacturer: 'Cimed', category: 'Remédios', active_principle: 'Dipirona + Cafeína', requires_prescription: 0, price: 9.90, stock: 90, image_url: 'nevralgex.webp' },
    { name: 'Metronidazol 400mg', manufacturer: 'Prati-Donaduzzi', category: 'Remédios', active_principle: 'Metronidazol', requires_prescription: 1, price: 22.00, stock: 30, image_url: 'metronidazol.webp' },
    { name: 'Salonpas Wisamitsu', manufacturer: 'Hisamitsu', category: 'Remédios', active_principle: 'Salicilato de Metila', requires_prescription: 0, price: 18.50, stock: 45, image_url: 'salonpas-wisamitsu.webp' },
    
    // Beleza
    { name: 'Bepantol Derma 30g', manufacturer: 'Bayer', category: 'Beleza', active_principle: 'Dexpantenol', requires_prescription: 0, price: 35.00, stock: 40, image_url: 'bepantol-30g.webp' },
    { name: 'Elseve Óleo Extraordinário', manufacturer: 'L\'Oréal', category: 'Beleza', active_principle: 'Óleos de Flores', requires_prescription: 0, price: 42.90, stock: 25, image_url: 'elseve-oleo.webp' },
    { name: 'Escova de Dente Colgate', manufacturer: 'Colgate', category: 'Beleza', active_principle: 'Higiene', requires_prescription: 0, price: 15.00, stock: 100, image_url: 'escova-dente-colgate.webp' },
    { name: 'Hidratante Labial Nivea', manufacturer: 'Nivea', category: 'Beleza', active_principle: 'Óleos Naturais', requires_prescription: 0, price: 19.90, stock: 70, image_url: 'hidratantelabialnivea.webp' },
    { name: 'Desodorante Rexona', manufacturer: 'Unilever', category: 'Beleza', active_principle: 'Antitranspirante', requires_prescription: 0, price: 16.50, stock: 150, image_url: 'rexona-desodorante.webp' },
    { name: 'Sabonete Dove', manufacturer: 'Unilever', category: 'Beleza', active_principle: 'Higiene', requires_prescription: 0, price: 4.50, stock: 200, image_url: 'sabonete-dove.webp' },

    // Infantil
    { name: 'Fralda BabyBee M', manufacturer: 'BabyBee', category: 'Infantil', active_principle: 'Higiene Infantil', requires_prescription: 0, price: 39.90, stock: 50, image_url: 'fralda-babybee.webp' },
    { name: 'Fralda Pampers G', manufacturer: 'P&G', category: 'Infantil', active_principle: 'Higiene Infantil', requires_prescription: 0, price: 89.90, stock: 40, image_url: 'fralda-pampers.webp' },
    { name: 'Kit Higiene Lunis', manufacturer: 'Lunis', category: 'Infantil', active_principle: 'Higiene Infantil', requires_prescription: 0, price: 55.00, stock: 20, image_url: 'kit-higiene-lunis.webp' },
    { name: 'Nestonutri', manufacturer: 'Nestlé', category: 'Infantil', active_principle: 'Suplemento Infantil', requires_prescription: 0, price: 45.00, stock: 35, image_url: 'nestonutri.webp' },
    { name: 'Seringa Nasal', manufacturer: 'Buba', category: 'Infantil', active_principle: 'Higiene Nasal', requires_prescription: 0, price: 29.90, stock: 60, image_url: 'seringa-nasal.webp' },

    // Suplementos
    { name: 'Creatina Dux', manufacturer: 'Dux Nutrition', category: 'Suplementos', active_principle: 'Creatina Monohidratada', requires_prescription: 0, price: 110.00, stock: 15, image_url: 'creatina-dux.webp' },
    { name: 'Whey Protein Dux', manufacturer: 'Dux Nutrition', category: 'Suplementos', active_principle: 'Whey Protein Isolate', requires_prescription: 0, price: 189.00, stock: 10, image_url: 'whey-dux.webp' },
    { name: 'Whey Protein Max Titanium', manufacturer: 'Max Titanium', category: 'Suplementos', active_principle: 'Whey Protein Blend', requires_prescription: 0, price: 159.00, stock: 12, image_url: 'whey-max.webp' },

    // Vacinas
    { name: 'Vacina COVID-19', manufacturer: 'Pfizer', category: 'Vacinas', active_principle: 'mRNA', requires_prescription: 0, price: 0.00, stock: 500, image_url: 'vacina_covid_19-5.webp' },
    { name: 'Vacina Febre Amarela', manufacturer: 'Sanofi', category: 'Vacinas', active_principle: 'Vírus Atenuado', requires_prescription: 0, price: 120.00, stock: 30, image_url: 'vacina_febre_amarela.webp' },
    { name: 'Vacina Gripe 2023', manufacturer: 'Butantan', category: 'Vacinas', active_principle: 'Vírus Fragmentado', requires_prescription: 0, price: 80.00, stock: 100, image_url: 'vacina_gripe_2023.webp' },

    // Primeiros Socorros
    { name: 'Atadura Neve 10cm', manufacturer: 'Neve', category: 'Primeiros Socorros', active_principle: 'Atadura de Algodão', requires_prescription: 0, price: 5.50, stock: 200, image_url: 'atadura-neve.webp' },
    { name: 'Esparadrapo Missner', manufacturer: 'Missner', category: 'Primeiros Socorros', active_principle: 'Fita Adesiva', requires_prescription: 0, price: 12.00, stock: 150, image_url: 'missner-esparadrapo.webp' },
    { name: 'Solução Fisiológica Lunis', manufacturer: 'Lunis', category: 'Primeiros Socorros', active_principle: 'Cloreto de Sódio 0,9%', requires_prescription: 0, price: 7.90, stock: 100, image_url: 'solucao-fisiologica-lunis.webp' },
  ];

  const insertMany = db.transaction((docs: any[]) => {
    for (const d of docs) {
      insert.run(
        d.name, 
        d.manufacturer, 
        d.category, 
        d.active_principle, 
        d.requires_prescription, 
        d.price, 
        d.stock,
        d.image_url
      );
    }
  });

  insertMany(medicines);

  console.log('Seed: ' + medicines.length + ' medicamentos adicionados com sucesso.');
}

