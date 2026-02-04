import { Router } from 'express';
import { DoctorController } from './DoctorController.js';

const router = Router();

router.post('/', DoctorController.create);

export default router;