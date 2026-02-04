import request from "supertest";
import app from "../src/app";
import { db } from "../src/config/database";
import jwt from "jsonwebtoken";

describe("Medicine Module", () => {
  let token: string;

  beforeAll(() => {
    // Generate token for tests
    token = jwt.sign(
      { id: 1, email: "test@test.com" },
      process.env.JWT_SECRET || "secret",
    );
  });

  beforeEach(() => {
    db.prepare("DELETE FROM medicines").run();

    db.prepare(
      `
      INSERT INTO medicines (
        name, manufacturer, active_principle,
        requires_prescription, price, stock
      ) VALUES (?, ?, ?, ?, ?, ?)
    `,
    ).run("Dipirona", "Farmácia Teste", "Dipirona", 0, 12.5, 100);
  });

  describe("POST /medicines", () => {
    it("deve cadastrar um medicamento", async () => {
      const response = await request(app)
        .post("/medicines")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Dipirona",
          manufacturer: "EMS",
          active_principle: "Dipirona",
          requires_prescription: 0,
          price: 12.5,
          stock: 20,
        });

      if (response.status !== 201) {

      }
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
    });
  });

  describe("GET /medicines", () => {
    it("deve listar todos os medicamentos", async () => {
      const response = await request(app).get("/medicines");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("name");
      expect(response.body[0]).toHaveProperty("stock");
    });

    it("deve buscar medicamento por id", async () => {
      const medicine = db
        .prepare(
          `
        SELECT id FROM medicines LIMIT 1
      `,
        )
        .get() as { id: number };

      const response = await request(app)
        .get(`/medicines/${medicine.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", medicine.id);
      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("price");
      expect(response.body).toHaveProperty("requires_prescription");
    });

    it("deve retornar 404 se medicamento não existir", async () => {
      const response = await request(app)
        .get("/medicines/999999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("PUT /medicines/:id", () => {
    it("deve atualizar apenas o estoque", async () => {
      const medicine = db
        .prepare("SELECT id, stock FROM medicines LIMIT 1")
        .get() as { id: number; stock: number };

      const response = await request(app)
        .put(`/medicines/${medicine.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          stock: medicine.stock + 10,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("stock", medicine.stock + 10);
    });

    it("deve atualizar apenas o preço", async () => {
      const medicine = db.prepare("SELECT id FROM medicines LIMIT 1").get() as {
        id: number;
      };

      const response = await request(app)
        .put(`/medicines/${medicine.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          price: 19.9,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("price", 19.9);
    });

    it("não deve permitir estoque negativo", async () => {
      const medicine = db.prepare("SELECT id FROM medicines LIMIT 1").get() as {
        id: number;
      };

      const response = await request(app)
        .put(`/medicines/${medicine.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          stock: -5,
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });

    it("não deve permitir preço menor ou igual a zero", async () => {
      const medicine = db.prepare("SELECT id FROM medicines LIMIT 1").get() as {
        id: number;
      };

      const response = await request(app)
        .put(`/medicines/${medicine.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          price: 0,
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });

    it("deve retornar 404 se medicamento não existir", async () => {
      const response = await request(app)
        .put("/medicines/999999")
        .set("Authorization", `Bearer ${token}`)
        .send({
          stock: 10,
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("DELETE /medicines/:id", () => {
    it("deve deletar um medicamento existente", async () => {
      const medicine = db
        .prepare(
          `
          INSERT INTO medicines (
            name, manufacturer, active_principle,
            requires_prescription, price, stock
          ) VALUES (?, ?, ?, ?, ?, ?)
          RETURNING id
        `,
        )
        .get("Medicamento Delete", "Teste", "Teste", 0, 10, 10) as {
        id: number;
      };

      const response = await request(app)
        .delete(`/medicines/${medicine.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);

      const deleted = db
        .prepare("SELECT * FROM medicines WHERE id = ?")
        .get(medicine.id);

      expect(deleted).toBeUndefined();
    });

    it("deve retornar 404 ao tentar deletar medicamento inexistente", async () => {
      const response = await request(app)
        .delete("/medicines/999999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message");
    });
  });
});
