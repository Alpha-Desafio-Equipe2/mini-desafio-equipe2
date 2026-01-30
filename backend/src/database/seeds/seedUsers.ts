import { db } from "../../config/database.js";
import bcrypt from "bcryptjs";

export function seedUsers() {
  const adminEmail = "admin@email.com";
  const clientEmail = "client@email.com";
  const saltRounds = 8;
  const adminPassword = bcrypt.hashSync("admin123", saltRounds);
  const clientPassword = bcrypt.hashSync("client123", saltRounds);

  const insertUser = db.prepare(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
  );

  const insertCustomer = db.prepare(
    "INSERT INTO customers (name, cpf, user_id, email) VALUES (?, ?, ?, ?)",
  );

  console.log("Checking default users...");

  // 1. Check/Insert Admin
  const existingAdmin = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(adminEmail) as any;
  if (!existingAdmin) {
    insertUser.run("Admin User", adminEmail, adminPassword, "admin");
    console.log("Admin User created.");
  } else {
    console.log("Admin User already exists.");
  }

  // 2. Check/Insert Client
  let clientUser = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(clientEmail) as any;
  if (!clientUser) {
    const info = insertUser.run(
      "Client User",
      clientEmail,
      clientPassword,
      "client",
    );
    clientUser = { id: info.lastInsertRowid };
    console.log("Client User created.");
  } else {
    console.log("Client User already exists.");
  }

  // 3. Check/Insert Client's Customer Profile
  const existingCustomer = db
    .prepare("SELECT * FROM customers WHERE user_id = ?")
    .get(clientUser.id);
  if (!existingCustomer) {
    insertCustomer.run(
      "Client User",
      "12345678900",
      clientUser.id,
      clientEmail,
    );
    console.log("Customer profile for Client created.");
  } else {
    console.log("Customer profile for Client already exists.");
  }
}
