import request from "supertest";
import { db } from "../src/config/database";
import jwt from "jsonwebtoken";
import app from "../src/app.js";

describe("Sales Module", () => {
  let token: string;
  let medicineId: number;
  let restrictedMedicineId: number;

  beforeAll(() => {
    token = jwt.sign(
      { id: 1, email: "test@test.com" },
      process.env.JWT_SECRET || "secret",
    );
  });

  beforeEach(() => {
    // Delete items in correct order to avoid FK constraint failures
    db.prepare("DELETE FROM sale_items").run();
    db.prepare("DELETE FROM sales").run();
    db.prepare("DELETE FROM medicines").run();

    // Create standard medicine
    const result = db
      .prepare(
        `
      INSERT INTO medicines (name, manufacturer, active_principle, requires_prescription, price, stock)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      )
      .run("Dipirona", "EMS", "Dipirona", 0, 10.0, 100);
    medicineId = Number(result.lastInsertRowid);

    // Create restricted medicine
    const restrictedResult = db
      .prepare(
        `
      INSERT INTO medicines (name, manufacturer, active_principle, requires_prescription, price, stock)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      )
      .run("Antibiotico", "EMS", "Amoxicilina", 1, 50.0, 100);
    restrictedMedicineId = Number(restrictedResult.lastInsertRowid);
  });

  describe("POST /sales", () => {
    it("should create a sale successfully", async () => {
      const response = await request(app)
        .post("/sales")
        .set("Authorization", `Bearer ${token}`)
        .send({
          branch_id: 1,
          items: [{ medicine_id: medicineId, quantity: 2 }],
        });

      if (response.status !== 201) {
        console.error(
          "Test Failed Response Body:",
          JSON.stringify(response.body, null, 2),
        );
      }
      expect(response.body.error).toBeUndefined();
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.total).toBe(20.0);
    });

    it("should fail if stock is insufficient", async () => {
      const response = await request(app)
        .post("/sales")
        .set("Authorization", `Bearer ${token}`)
        .send({
          branch_id: 1,
          items: [{ medicine_id: medicineId, quantity: 101 }],
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/Insufficient stock/);
    });

    it("should create a sale with payment method", async () => {
      const response = await request(app)
        .post("/sales")
        .set("Authorization", `Bearer ${token}`)
        .send({
          branch_id: 1,
          items: [{ medicine_id: medicineId, quantity: 1 }],
          payment_method: "credit_card",
        });

      expect(response.status).toBe(201);

      const sale = db
        .prepare("SELECT * FROM sales WHERE id = ?")
        .get(response.body.id) as any;
      expect(sale.payment_method).toBe("credit_card");
    });

    it("should fail if prescription medicine is sold without doctor info", async () => {
      const response = await request(app)
        .post("/sales")
        .set("Authorization", `Bearer ${token}`)
        .send({
          branch_id: 1,
          items: [{ medicine_id: restrictedMedicineId, quantity: 1 }],
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/requires prescription/);
    });

    it("should fail if doctor info is missing CRM", async () => {
      const response = await request(app)
        .post("/sales")
        .set("Authorization", `Bearer ${token}`)
        .send({
          branch_id: 1,
          items: [{ medicine_id: restrictedMedicineId, quantity: 1 }],
          doctor_crm: undefined,
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/requires prescription/);
    });

    it("should create sale with prescription medicine if doctor info is valid", async () => {
      const response = await request(app)
        .post("/sales")
        .set("Authorization", `Bearer ${token}`)
        .send({
          branch_id: 1,
          items: [{ medicine_id: restrictedMedicineId, quantity: 1 }],
          doctor_crm: "12345/SP",
          prescription_date: new Date().toISOString(),
        });

      if (response.status !== 201) {

      }
      expect(response.status).toBe(201);
      expect(response.body.total).toBe(50.0);
    });

    it("should decrement stock after sale", async () => {
      await request(app)
        .post("/sales")
        .set("Authorization", `Bearer ${token}`)
        .send({
          branch_id: 1,
          items: [{ medicine_id: medicineId, quantity: 5 }],
        });

      const medicine = db
        .prepare("SELECT stock FROM medicines WHERE id = ?")
        .get(medicineId) as any;
      expect(medicine.stock).toBe(95);
    });

    it("should fail when item quantity is negative or zero", async () => {
      const response = await request(app)
        .post("/sales")
        .set("Authorization", `Bearer ${token}`)
        .send({
          branch_id: 1,
          items: [{ medicine_id: medicineId, quantity: -1 }],
        });

      expect(response.status).toBe(400);
    });

    it("should fail with invalid medicine_id", async () => {
      const response = await request(app)
        .post("/sales")
        .set("Authorization", `Bearer ${token}`)
        .send({
          branch_id: 1,
          items: [{ medicine_id: 999999, quantity: 1 }],
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/not found/);
    });
  });
});
