import { db } from "../../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  async login(data: any) {
    const { email, password } = data;

    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as any;

    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1d",
      },
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}
