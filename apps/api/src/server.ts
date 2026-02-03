import 'dotenv/config';
import express from 'express';
import app from './app.js';
import { initDatabase } from './config/database.js';
import './database/schema.js';
import { runSeeds } from './database/seeds/index.js';

const PORT = process.env.PORT || 3000;

try {
  initDatabase();
  runSeeds();

  // Listen only on 127.0.0.1 for security - exposure is handled by Nginx
  app.listen(Number(PORT), '127.0.0.1', () => {
    console.log(`Server (local-only) running on port ${PORT}`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}
