import { Router } from 'express';
import { DoctorController } from './DoctorController.js';

const doctorRoutes = Router();

doctorRoutes.post('/', DoctorController.create);
doctorRoutes.get('/', DoctorController.list);
doctorRoutes.get('/:id', DoctorController.show);
doctorRoutes.get('/crm/:crm', DoctorController.findByCRM);
doctorRoutes.put('/:id', DoctorController.update);
doctorRoutes.delete('/:id', DoctorController.delete);

export { doctorRoutes };