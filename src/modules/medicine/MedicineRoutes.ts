import { Router } from 'express';
import { MedicineController } from './MedicineController.js';

const router = Router();

router.post('/', MedicineController.create);

export default router;
