import { Router } from "express";
import { SaleController } from "./SaleController.js";
import { isAuthenticated } from "../auth/AuthMiddleware.js";

const routes = Router();
const saleController = new SaleController();

// Middleware para verificar se é admin
const isAdmin = (req: any, res: any, next: any) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
    next();
  } else {
    res.status(403).json({ error: "Only admins can confirm sales" });
  }
};

routes.post("/", (req, res, next) => saleController.create(req, res, next));
routes.get("/", (req, res, next) => saleController.getAll(req, res, next));
routes.get("/:id", (req, res, next) => saleController.getById(req, res, next));
routes.patch("/:id/confirm", isAuthenticated, isAdmin, (req, res, next) => saleController.confirm(req, res, next));
routes.post("/:id/cancel", (req, res, next) => saleController.cancel(req, res, next));

export default routes;
