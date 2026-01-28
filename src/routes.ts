import { Router } from 'express';
import authRoutes from './modules/auth/AuthRoutes.js';
import customerRoutes from "./modules/customer/CustomerRoutes.js"; 
const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/customer', customerRoutes);
import medicineRoutes from './modules/medicine/MedicineRoutes.js';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/medicines', medicineRoutes);

export default routes;