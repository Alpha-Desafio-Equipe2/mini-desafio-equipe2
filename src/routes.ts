import { Router } from 'express';
import authRoutes from './modules/auth/AuthRoutes';

const routes = Router();

routes.use('/auth', authRoutes);

export default routes;