import { Router } from 'express';
import { MedicineController } from './MedicineController.js';
import { isAuthenticated } from "../../modules/auth/AuthMiddleware.js";

const router = Router();

router.get('/', MedicineController.getAll);
router.post('/', isAuthenticated, MedicineController.create);
router.get('/:id', isAuthenticated, MedicineController.getById);
router.put('/:id', isAuthenticated, MedicineController.update);
router.delete('/:id', isAuthenticated, MedicineController.delete);

export default router;
