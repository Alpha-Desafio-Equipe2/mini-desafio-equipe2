import { Router } from 'express';
import { CustomerController } from './CustomerController.js';

const customerRoutes = Router();
const customerController = new CustomerController();

customerRoutes.post('/', (req, res) => customerController.create(req, res));

export default customerRoutes;
