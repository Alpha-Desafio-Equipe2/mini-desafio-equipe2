import { db } from "../../config/database.js";
import bcrypt from "bcryptjs";

export function seedUsers() {
  const adminEmail = "admin@email.com";
  const existingAdmin = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(adminEmail);

  if (!existingAdmin) {
    console.log("Seeding default users...");

    // Clear legacy users to ensure clean state
    db.prepare("DELETE FROM users").run();

    const saltRounds = 8;
    const adminPassword = bcrypt.hashSync("admin123", saltRounds);
    const clientPassword = bcrypt.hashSync("client123", saltRounds);

    const insert = db.prepare(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    );

    insert.run("Admin User", adminEmail, adminPassword, "admin");
    insert.run("Client User", "client@email.com", clientPassword, "client");

    console.log("Users seeded successfully (Database reset).");
  } else {
    console.log("Default users already exist.");
  }
}
