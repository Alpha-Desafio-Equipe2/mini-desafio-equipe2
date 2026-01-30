import request from "supertest";
import app from "../src/app";
import { db } from "../src/config/database";
import bcrypt from "bcryptjs";

describe("Auth Module", () => {
  beforeEach(() => {
    db.prepare("DELETE FROM customers").run();
    db.prepare("DELETE FROM users").run();
  });

  const validUser = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    cpf: "12345678900",
  };

  describe("POST /farma-project/auth/register", () => {
    it("should register a new user and customer successfully", async () => {
      const response = await request(app)
        .post("/farma-project/auth/register")
        .send(validUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "User created successfully",
      );

      const user = db
        .prepare("SELECT * FROM users WHERE email = ?")
        .get(validUser.email);
      expect(user).toBeDefined();

      const customer = db
        .prepare("SELECT * FROM customers WHERE cpf = ?")
        .get(validUser.cpf);
      expect(customer).toBeDefined();
    });

    it("should fail when registering with existing email", async () => {
      // Create first user
      await request(app).post("/farma-project/auth/register").send(validUser);

      // Try to create same user again
      const response = await request(app)
        .post("/farma-project/auth/register")
        .send({ ...validUser, cpf: "00987654321" }); // Different CPF, same email

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/Email already registered/);
    });

    it("should fail when registering with existing CPF", async () => {
      // Create first user
      await request(app).post("/farma-project/auth/register").send(validUser);

      // Try to create user with same CPF
      const response = await request(app)
        .post("/farma-project/auth/register")
        .send({ ...validUser, email: "other@example.com" }); // Different email, same CPF

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/CPF already registered/);
    });
  });

  describe("POST /farma-project/auth/login", () => {
    beforeEach(async () => {
      // Seed a user for login tests
      const hashedPassword = await bcrypt.hash(validUser.password, 8);
      db.prepare(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'client')",
      ).run(validUser.name, validUser.email, hashedPassword);
    });

    it("should login successfully with valid credentials", async () => {
      const response = await request(app)
        .post("/farma-project/auth/login")
        .send({
          email: validUser.email,
          password: validUser.password,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toHaveProperty("email", validUser.email);
    });

    it("should fail with invalid password", async () => {
      const response = await request(app)
        .post("/farma-project/auth/login")
        .send({
          email: validUser.email,
          password: "wrongpassword",
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid password");
    });

    it("should fail with non-existent user", async () => {
      const response = await request(app)
        .post("/farma-project/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        });

      expect(response.status).toBe(401); // Or 404 depending on implementation, usually 401 for security
      // Based on AuthService.ts: if (!user) throw new Error("User not found");
      // AuthController returns 401 for any error.
      expect(response.body.message).toBe("User not found");
    });
  });
});
