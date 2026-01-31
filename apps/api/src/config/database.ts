import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Apontando para a raiz do monorepo /data/database.sqlite
const DATABASE_PATH = process.env.DATABASE_PATH || path.resolve(__dirname, '../../../../data/database.sqlite');

export const db = new Database(DATABASE_PATH, { 
    verbose: console.log 
});

// Otimizações Sênior recomendadas pelo Arquiteto
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

export function initDatabase() {
  console.log('Database connected (SQLite) at:', DATABASE_PATH);
}
