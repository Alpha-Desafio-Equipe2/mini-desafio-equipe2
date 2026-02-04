
const { db } = require('./build/config/database.js');
const { SaleRepository } = require('./build/modules/sale/repositories/SaleRepository.js');

try {
  console.log("Running migration check...");
  const saleColumns = db.prepare("PRAGMA table_info(sales)").all();
  const hasUserId = saleColumns.some(col => col.name === 'user_id');
  
  if (!hasUserId) {
    console.log("Adding user_id column...");
    db.exec("ALTER TABLE sales ADD COLUMN user_id INTEGER");
  } else {
    console.log("user_id column already exists.");
  }

  console.log("Creating sale with user_id...");
  const saleId = SaleRepository.create({
    user_id: 123,
    total_value: 100.0,
    status: 'pending'
  });

  const sale = db.prepare("SELECT * FROM sales WHERE id = ?").get(saleId);
  console.log("Sale created:", sale);

  if (sale.user_id === 123) {
    console.log("SUCCESS: user_id persisted correctly.");
  } else {
    console.error("FAILURE: user_id mismatch.", sale.user_id);
  }

  // Cleanup
  db.prepare("DELETE FROM sales WHERE id = ?").run(saleId);

} catch (error) {
  console.error("Verification Error:", error);
}
