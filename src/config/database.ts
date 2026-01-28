import Database from 'better-sqlite3';
import path from 'path';

const DATABASE_PATH = process.env.DATABASE_PATH || 'src/database/farmacia.sqlite';


const dbPath = path.resolve(DATABASE_PATH);

export const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

export function initDatabase() {
  console.log('Database connected (SQLite)');
}
