import { db } from "./src/config/database.js";

try {
  const users = db.prepare("SELECT * FROM users").all();
  console.log("--- FOUND USERS ---");
  console.log(JSON.stringify(users, null, 2));
  console.log("-------------------");
} catch (error) {
  console.error("Error querying users:", error);
}
