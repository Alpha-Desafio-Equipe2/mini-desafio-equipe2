import { Router } from "express";
import authRoutes from "./modules/auth/AuthRoutes.js";
import medicineRoutes from "./modules/medicine/MedicineRoutes.js";
import customerRoutes from "./modules/customer/CustomerRoutes.js";
import userRoutes from "./modules/user/UserRoutes.js";
import saleRoutes from "./modules/sale/SaleRoutes.js";
import { isAuthenticated } from "./modules/auth/AuthMiddleware.js";
import { doctorRoutes } from './modules/doctor/DoctorRoutes.js';

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/medicines", medicineRoutes); // Public or Protected? Vide Medicine routes
routes.use("/customers", isAuthenticated, customerRoutes);
routes.use("/users", isAuthenticated, userRoutes);
routes.use("/sales", isAuthenticated, saleRoutes);
routes.use('/doctors', doctorRoutes);

export default routes;
