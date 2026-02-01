import express from 'express';
import "dotenv/config";
import app from './app.js';
import { initDatabase } from './config/database.js';
import './database/schema.js';
import { runSeeds } from './database/seeds/index.js';

try {
  initDatabase();
  runSeeds();

  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}
