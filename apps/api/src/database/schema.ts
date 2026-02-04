import { db } from "../config/database.js";

// =======================
// CATEGORIES
// =======================
db.exec(`
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

// =======================
// MEDICINES
// =======================
db.exec(`
CREATE TABLE IF NOT EXISTS medicines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  manufacturer TEXT,
  active_principle TEXT NOT NULL,
  requires_prescription INTEGER NOT NULL CHECK(requires_prescription IN (0,1)),
  price REAL NOT NULL,
  stock INTEGER NOT NULL CHECK (stock >= 0),
  image_url TEXT,
  category_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
`);

// =======================
// CUSTOMERS
// =======================
db.exec(`
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  email TEXT,
  user_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`);

// =======================
// DOCTORS
// =======================
db.exec(`
CREATE TABLE IF NOT EXISTS doctors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  crm TEXT UNIQUE NOT NULL,
  specialty TEXT, 
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

// =======================
// SALES
// =======================
db.exec(`
CREATE TABLE IF NOT EXISTS sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER,
  branch_id INTEGER NOT NULL,
  total_value REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  doctor_crm TEXT,
  prescription_date TEXT,
  payment_method TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
`);

// =======================
// BRANCHES
// =======================
db.exec(`
CREATE TABLE IF NOT EXISTS branches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

// =======================
// SALE ITEMS
// =======================
db.exec(`
CREATE TABLE IF NOT EXISTS sale_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sale_id INTEGER NOT NULL,
  medicine_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  total_price REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sale_id) REFERENCES sales(id),
  FOREIGN KEY (medicine_id) REFERENCES medicines(id)
);
`);

// =======================
// USERS
// =======================
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'attendant',
  balance REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

// =======================
// MIGRATIONS
// =======================
try {
  // Check if balance exists in users
  const userColumns = db.prepare("PRAGMA table_info(users)").all() as any[];
  const hasBalance = userColumns.some(col => col.name === 'balance');
  
  if (!hasBalance) {
    console.log("Migrating: Adding balance column to users table...");
    db.exec("ALTER TABLE users ADD COLUMN balance REAL DEFAULT 0");
  }

  // Check if image_url exists in medicines
  const medicineColumns = db.prepare("PRAGMA table_info(medicines)").all() as any[];
  const hasImageUrl = medicineColumns.some(col => col.name === 'image_url');
  
  if (!hasImageUrl) {
    console.log("Migrating: Adding image_url column to medicines table...");
    db.exec("ALTER TABLE medicines ADD COLUMN image_url TEXT");
  }

  // Check if category_id exists in medicines
  const hasCategoryId = medicineColumns.some(col => col.name === 'category_id');
  
  if (!hasCategoryId) {
    console.log("Migrating: Adding category_id column to medicines table...");
    db.exec("ALTER TABLE medicines ADD COLUMN category_id INTEGER REFERENCES categories(id)");
  }
} catch (error) {
  console.error("Migration error:", error);
}