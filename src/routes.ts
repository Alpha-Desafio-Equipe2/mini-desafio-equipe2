import { Router } from 'express';
import authRoutes from './modules/auth/AuthRoutes.js';
import customerRoutes from "./modules/customer/CustomerRoutes.js";
import medicineRoutes from './modules/medicine/MedicineRoutes.js';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/medicines', medicineRoutes);
routes.use('/customer', customerRoutes);


export default routes;