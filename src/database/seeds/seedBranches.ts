import { db } from "../../config/database.js";

export function seedBranches() {
  const existingBranch = db
    .prepare("SELECT id FROM branches WHERE cnpj = ?")
    .get("00.000.000/0001-00");

  if (!existingBranch) {
    console.log("Seeding default branch...");

    const insert = db.prepare(
      "INSERT INTO branches (name, cnpj) VALUES (?, ?)"
    );

    insert.run("Farmácia Popular - Matriz", "00.000.000/0001-00");

    console.log("Branch seeded successfully.");
  } else {
    console.log("Branch already seeded");
  }
}
