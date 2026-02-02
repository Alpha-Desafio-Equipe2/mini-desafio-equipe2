import { Router } from "express";
import { SaleController } from "./SaleController.js";
import { isAuthenticated } from "../auth/AuthMiddleware.js";
import { SaleRepository } from "./repositories/SaleRepository.js";

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

// Middleware para verificar autorização no cancelamento (cliente dono ou admin)
const canCancelSale = (req: any, res: any, next: any) => {
  const { id } = req.params;
  const sale = SaleRepository.findById(Number(id));
  
  if (!sale) {
    return res.status(404).json({ error: "Sale not found" });
  }

  const isAdminUser = req.user && (req.user.role === 'admin' || req.user.role === 'manager');

  // If sale.customer_id references a customer row, try to resolve its user_id
  let saleBelongsToUser = false;
  try {
    const customer = SaleRepository.findCustomerBySaleId(Number(id));
    if (customer && customer.user_id && req.user) {
      saleBelongsToUser = Number(customer.user_id) === Number(req.user.id);
    }
  } catch (err) {
    // ignore lookup errors
  }

  // Fallback: sometimes customer_id may directly equal user id in legacy data
  if (!saleBelongsToUser && req.user) {
    saleBelongsToUser = Number(sale.customer_id) === Number(req.user.id);
  }

  if (isAdminUser || saleBelongsToUser) {
    next();
  } else {
    res.status(403).json({ error: "You can only cancel your own orders" });
  }
};

routes.post("/", (req, res, next) => saleController.create(req, res, next));
routes.get("/", (req, res, next) => saleController.getAll(req, res, next));
routes.get("/:id", (req, res, next) => saleController.getById(req, res, next));
routes.patch("/:id/confirm", isAuthenticated, isAdmin, (req, res, next) => saleController.confirm(req, res, next));
routes.post("/:id/cancel", isAuthenticated, canCancelSale, (req, res, next) => saleController.cancel(req, res, next));

export default routes;
