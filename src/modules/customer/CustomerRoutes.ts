import { Router } from "express";
import { CustomerController } from "./CustomerController.js";

const customerRoutes = Router();

customerRoutes.post("/", CustomerController.create);
customerRoutes.get("/", CustomerController.getAll);
customerRoutes.get("/:id", CustomerController.getById);
customerRoutes.put("/:id", CustomerController.update);
customerRoutes.delete("/:id", CustomerController.delete);

export default customerRoutes;
