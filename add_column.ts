
import { db } from './apps/api/src/config/database.js';

try {
  db.exec("ALTER TABLE medicines ADD COLUMN image_url TEXT");
  console.log("Column added successfully");
} catch (error) {
  console.log("Column might already exist or error:", error);
}
