import { Router } from 'express';
import { MedicineController } from './MedicineController.js';
import { isAuthenticated } from "../../modules/auth/AuthMiddleware.js";

const router = Router();
const medicineController = new MedicineController();

router.get('/', (req, res, next) => medicineController.getAll(req, res, next));
router.post('/', isAuthenticated, (req, res, next) => medicineController.create(req, res, next));
router.get('/:id', isAuthenticated, (req, res, next) => medicineController.getById(req, res, next));
router.put('/:id', isAuthenticated, (req, res, next) => medicineController.update(req, res, next));
router.delete('/:id', isAuthenticated, (req, res, next) => medicineController.delete(req, res, next));

export default router;
