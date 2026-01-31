import { Router } from "express";
import { SaleController } from "./SaleController.js";
import { isAuthenticated } from "../auth/AuthMiddleware.js";

const routes = Router();
const saleController = new SaleController();

routes.post("/", (req, res, next) => saleController.create(req, res, next));
routes.get("/", (req, res, next) => saleController.getAll(req, res, next));
routes.get("/:id", (req, res, next) => saleController.getById(req, res, next));
routes.patch("/:id/confirm", (req, res, next) => saleController.confirm(req, res, next));
routes.post("/:id/cancel", (req, res, next) => saleController.cancel(req, res, next));

export default routes;
