import { db } from "../config/database.js";

/**
 * Migration script to add new columns to existing tables
 * Run this if your database was created before the schema updates
 */
export function runMigrations() {
  console.log("Running database migrations...");

  try {
    // Check if sales table has the new columns
    const salesColumns = db.prepare("PRAGMA table_info(sales)").all() as any[];
    const hasStatus = salesColumns.some((col) => col.name === "status");
    const hasDoctorCrm = salesColumns.some((col) => col.name === "doctor_crm");
    const hasPrescriptionDate = salesColumns.some(
      (col) => col.name === "prescription_date"
    );

    if (!hasStatus || !hasDoctorCrm || !hasPrescriptionDate) {
      console.log("Migrating sales table...");

      if (!hasStatus) {
        db.exec("ALTER TABLE sales ADD COLUMN status TEXT DEFAULT 'pending'");
        console.log("  ✓ Added 'status' column");
      }

      if (!hasDoctorCrm) {
        db.exec("ALTER TABLE sales ADD COLUMN doctor_crm TEXT");
        console.log("  ✓ Added 'doctor_crm' column");
      }

      if (!hasPrescriptionDate) {
        db.exec("ALTER TABLE sales ADD COLUMN prescription_date TEXT");
        console.log("  ✓ Added 'prescription_date' column");
      }
    } else {
      console.log("Sales table is up to date");
    }

    // Check if customers table has the new columns
    const customerColumns = db
      .prepare("PRAGMA table_info(customers)")
      .all() as any[];
    const hasEmail = customerColumns.some((col) => col.name === "email");
    const hasUserId = customerColumns.some((col) => col.name === "user_id");

    if (!hasEmail || !hasUserId) {
      console.log("Migrating customers table...");

      if (!hasEmail) {
        db.exec("ALTER TABLE customers ADD COLUMN email TEXT");
        console.log("  ✓ Added 'email' column");
      }

      if (!hasUserId) {
        db.exec("ALTER TABLE customers ADD COLUMN user_id INTEGER");
        console.log("  ✓ Added 'user_id' column");
      }
    } else {
      console.log("Customers table is up to date");
    }

    console.log("Migrations completed successfully!");
  } catch (error: any) {
    console.error("Migration failed:", error.message);
    throw error;
  }
}
