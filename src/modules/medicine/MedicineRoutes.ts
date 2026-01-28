import { Router } from 'express';
import { MedicineController } from './MedicineController.js';

const router = Router();

router.post('/', MedicineController.create);
router.get('/', MedicineController.getAll);
router.get('/:id', MedicineController.getById);

export default router;
