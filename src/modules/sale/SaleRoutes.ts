import { Router } from 'express';
import { SaleController } from './SaleController.js';

const saleRoutes = Router();
const saleController = new SaleController();

saleRoutes.post('/', saleController.create);
saleRoutes.get('/', saleController.list);
saleRoutes.get('/:id', saleController.show);
saleRoutes.post('/:id/confirm-payment', saleController.confirmPayment);
saleRoutes.post('/:id/cancel', saleController.cancel);
saleRoutes.post('/:id/items', saleController.addItem);
saleRoutes.delete('/:id/items/:itemId', saleController.removeItem);

export { saleRoutes };