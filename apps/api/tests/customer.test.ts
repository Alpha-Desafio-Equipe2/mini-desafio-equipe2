import request from "supertest";
import { db } from "../src/config/database";
import jwt from "jsonwebtoken";
import app from "../src/app.js";
import "../src/database/schema.js";

describe("Customer Module CRUD", () => {
  // Clear database before each test to ensure clean state
  beforeEach(() => {
    db.prepare("DELETE FROM customers").run();
  });

  // Test data helper
  const customerData = {
    name: "Test Customer",
    cpf: "12345678900",
  };

  const token = jwt.sign(
    { id: 1, email: "test@test.com" },
    process.env.JWT_SECRET || "secret",
  );

  describe("POST /customers", () => {
    it("should create a new customer", async () => {
      const response = await request(app)
        .post("/customers")
        .set("Authorization", `Bearer ${token}`)
        .send(customerData);

      if (response.status !== 201) {
        console.log("Customer Create Failed:", response.body);
      }
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe(customerData.name);
      expect(response.body.cpf).toBe(customerData.cpf);
    });

    it("should not create a customer with duplicate CPF", async () => {
      // Create first customer
      await request(app)
        .post("/customers")
        .set("Authorization", `Bearer ${token}`)
        .send(customerData);

      // Try to create duplicate
      const response = await request(app)
        .post("/customers")
        .set("Authorization", `Bearer ${token}`)
        .send(customerData);

      expect(response.status).toBe(409);
    });

    it("should return 400 when CPF has less than 11 digits", async () => {
      const response = await request(app)
        .post("/customers")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Short CPF", cpf: "123" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("CPF must contain exactly 11 digits");
    });

    it("should return 400 when CPF has more than 11 digits", async () => {
      const response = await request(app)
        .post("/customers")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Long CPF", cpf: "123456789012" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("CPF must contain exactly 11 digits");
    });

    it("should accept 11-digit CPF with dots and dashes", async () => {
      const response = await request(app)
        .post("/customers")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Formatted CPF", cpf: "123.456.789-00" });

      expect(response.status).toBe(201);
    });
  });

  describe("GET /customers", () => {
    it("should list all customers", async () => {
      // Create a customer first
      await request(app)
        .post("/customers")
        .set("Authorization", `Bearer ${token}`)
        .send(customerData);

      const response = await request(app)
        .get("/customers")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("GET /customers/:id", () => {
    it("should get a customer by id", async () => {
      // Create customer
      const createResponse = await request(app)
        .post("/customers")
        .set("Authorization", `Bearer ${token}`)
        .send(customerData);

      const id = createResponse.body.id;

      const response = await request(app)
        .get(`/customers/${id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(id);
      expect(response.body.name).toBe(customerData.name);
    });

    it("should return 404 for non-existent customer", async () => {
      const response = await request(app)
        .get("/customers/99999")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(404);
    });
  });

  describe("PUT /customers/:id", () => {
    it("should update a customer", async () => {
      // Create customer
      const createResponse = await request(app)
        .post("/customers")
        .set("Authorization", `Bearer ${token}`)
        .send(customerData);

      const id = createResponse.body.id;
      const updateData = { name: "Updated Name", cpf: "12345678900" };

      const response = await request(app)
        .put(`/customers/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
    });

    it("should return 404 when updating non-existent customer", async () => {
      const response = await request(app)
        .put("/customers/99999")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "New Name" });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /customers/:id", () => {
    it("should delete a customer", async () => {
      // Create customer
      const createResponse = await request(app)
        .post("/customers")
        .set("Authorization", `Bearer ${token}`)
        .send(customerData);

      const id = createResponse.body.id;

      const response = await request(app)
        .delete(`/customers/${id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);

      // Verify it's gone
      const getResponse = await request(app)
        .get(`/customers/${id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(getResponse.status).toBe(404);
    });

    it("should return 404 when deleting non-existent customer", async () => {
      const response = await request(app)
        .delete("/customers/99999")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(404);
    });
  });
});
