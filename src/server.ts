import app from './app';
import { initDatabase } from './config/database';
import { runSeeds } from './database/seeds';

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