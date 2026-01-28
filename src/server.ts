import app from './app.js';
import { initDatabase } from './config/database.js';
import './database/schema.js';
import { runSeeds } from './database/seeds/index.js';

const PORT = process.env.PORT || 3000;

try {
  initDatabase();
  runSeeds();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}
