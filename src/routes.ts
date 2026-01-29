import { Router } from "express";
import authRoutes from "./modules/auth/AuthRoutes.js";
import medicineRoutes from "./modules/medicine/MedicineRoutes.js";
import customerRoutes from "./modules/customer/CustomerRoutes.js";
import userRoutes from "./modules/user/UserRoutes.js";
import saleRoutes from "./modules/sale/SaleRoutes.js";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/medicines", medicineRoutes);
routes.use("/customers", customerRoutes);
routes.use("/users", userRoutes);
routes.use("/sales", saleRoutes);

export default routes;
