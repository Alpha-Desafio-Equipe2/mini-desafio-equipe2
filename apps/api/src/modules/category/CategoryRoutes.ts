import { Router } from 'express';
import { CategoryController } from './CategoryController.js';
import { isAuthenticated } from "../auth/AuthMiddleware.js";

const router = Router();
const categoryController = new CategoryController();

// Rotas públicas
router.get('/', (req, res, next) => categoryController.getAll(req, res, next));
router.get('/:id', (req, res, next) => categoryController.getById(req, res, next));

// Rotas protegidas (apenas usuários autenticados)
router.post('/', isAuthenticated, (req, res, next) => categoryController.create(req, res, next));
router.put('/:id', isAuthenticated, (req, res, next) => categoryController.update(req, res, next));
router.delete('/:id', isAuthenticated, (req, res, next) => categoryController.delete(req, res, next));

export default router;


