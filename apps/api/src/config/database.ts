import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Apontando para a raiz do monorepo /data/database.sqlite
const DATABASE_PATH = process.env.DATABASE_PATH || path.resolve(__dirname, '../../../../data/database.sqlite');
const DATABASE_DIR = path.dirname(DATABASE_PATH);

// Garante que a pasta existe (importante para deploy no Ubuntu)
if (!fs.existsSync(DATABASE_DIR)) {
    fs.mkdirSync(DATABASE_DIR, { recursive: true });
}

export const db = new Database(DATABASE_PATH, 
    // verbose: console.log 
);

// Otimizações Sênior recomendadas pelo Arquiteto
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

// Migration simplificada para adicionar coluna balance
try {
  const tableInfo = db.prepare("PRAGMA table_info(users)").all() as any[];
  const hasBalance = tableInfo.some(col => col.name === 'balance');
  
  if (!hasBalance) {
    db.prepare("ALTER TABLE users ADD COLUMN balance REAL DEFAULT 0.00").run();
    console.log("Migration: Added 'balance' column to users table.");
  }
} catch (error) {
  console.error("Migration Error:", error);
}

export function initDatabase() {
  console.log('Database connected (SQLite) at:', DATABASE_PATH);
}
