import { db } from "../../config/database.js";
import bcrypt from "bcryptjs";

export function seedUsers() {
  const adminEmail = "admin@email.com";
  const clientEmail = "client@email.com";
  const saltRounds = 8;
  const adminPasswordRaw = process.env.ADMIN_PASSWORD;
  const clientPasswordRaw = process.env.CLIENT_PASSWORD;

  if (!adminPasswordRaw || !clientPasswordRaw) {
    throw new Error("ADMIN_PASSWORD and CLIENT_PASSWORD must be set in .env");
  }
  

  const adminPassword = bcrypt.hashSync(adminPasswordRaw, saltRounds);
  const clientPassword = bcrypt.hashSync(clientPasswordRaw, saltRounds);

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
    // Update admin password
    const update = db.prepare("UPDATE users SET password = ? WHERE email = ?");
    update.run(adminPassword, adminEmail);
    console.log("Admin User already exists. Password updated.");
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
    // Update client password
    const update = db.prepare("UPDATE users SET password = ? WHERE email = ?");
    update.run(clientPassword, clientEmail);
    console.log("Client User already exists. Password updated.");
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
