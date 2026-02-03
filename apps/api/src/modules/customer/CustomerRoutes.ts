import { Router } from "express";
import { CustomerController } from "./CustomerController.js";
import { isAuthenticated } from "../auth/AuthMiddleware.js";

const routes = Router();
const customerController = new CustomerController();

routes.post("/", (req, res, next) => customerController.create(req, res, next));
routes.get("/", (req, res, next) => customerController.getAll(req, res, next));
routes.get("/:id", (req, res, next) => customerController.getById(req, res, next));
routes.put("/:id", (req, res, next) => customerController.update(req, res, next));
routes.delete("/:id", (req, res, next) => customerController.delete(req, res, next));

export default routes;
