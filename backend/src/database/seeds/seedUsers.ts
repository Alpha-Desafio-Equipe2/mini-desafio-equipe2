import { db } from "../../config/database.js";
import bcrypt from "bcryptjs";
import { UserRole } from "../../modules/user/domain/enums/UserRole.js";

export async function seedUsers() {
  const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (name, email, password, role, cpf)
  VALUES (?, ?, ?, ?, ?)
`);

  insertUser.run(
    "Admin User",
    "admin@email.com",
    bcrypt.hashSync("admin123", 8),
    UserRole.ADMIN,
    "12345432167"
  );

  insertUser.run(
    "User",
    "user@email.com",
    bcrypt.hashSync("user123", 8),
    UserRole.USER,
    "12345678900"
  );

  insertUser.run(
    "Pharmacist",
    "pharmacist@email.com",
    bcrypt.hashSync("pharmacist123", 8),
    UserRole.PHARMACIST,
    "12345678999"
  );

  console.log("Seed Users executed safely.");
}
