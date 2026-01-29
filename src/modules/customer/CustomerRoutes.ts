import { Router } from "express";
import { CustomerController } from "./CustomerController.js";

const customerRoutes = Router();
const customerController = new CustomerController();

customerRoutes.post("/", (req, res) => customerController.create(req, res));
customerRoutes.get("/", (req, res) => customerController.getAll(req, res));

export default customerRoutes;
