import { db } from "../../config/database.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { UserRole } from "../../modules/user/domain/enums/UserRole.js";

dotenv.config();

interface User {
  name: string;
  cpf: string;
  phone: string;
  address: string;
  email: string;
  password: string;
  role: UserRole;
  balance: number;
}


export function seedUsers() {
  const adminEmail = "admin@email.com";
  const saltRounds = 8;
  const adminPasswordRaw = process.env.ADMIN_PASSWORD;
  const clientPasswordRaw = process.env.CLIENT_PASSWORD;

  const count = db
    .prepare('SELECT COUNT(*) as total FROM users')
    .get() as { total: number };

  if (count.total > 0) {
    console.log('Users already seeded');
    return;
  }

  if (!adminPasswordRaw || !clientPasswordRaw) {
    throw new Error("ADMIN_PASSWORD and CLIENT_PASSWORD must be set in .env");
  }

  const adminPassword = bcrypt.hashSync(adminPasswordRaw, saltRounds);
  const clientPassword = bcrypt.hashSync(clientPasswordRaw, saltRounds);


  const insertUser = db.prepare(
    "INSERT INTO users (name, cpf, email, password, role, balance, phone, address ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  );

  const users = [
    {
      name: 'Admin', cpf: '123.456.888-00', email: 'admin@email.com', password: adminPassword, role: UserRole.ADMIN, balance: 70.00, phone: '123456789', address: 'Rua 2'
    },
    { name: 'Mariana', cpf: '456.789.123-00', email: 'mariana.costa@example.com', password: clientPassword, role: UserRole.USER, balance: 50.00, phone: '123456789', address: 'Rua 4' }
  ];

  const insertMany = db.transaction((users: User[]) => {
    for (const user of users) {
      insertUser.run(user.name, user.cpf, user.email, user.password, user.phone, user.address, user.role, user.balance);
    }
  });

  insertMany(users);

  console.log('Users seeded successfully');
}

