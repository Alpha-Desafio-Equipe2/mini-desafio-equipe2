import { Router } from "express";
import { UserController } from "./UserController.js";

const routes = Router();
const userController = new UserController();

routes.get("/", (req, res, next) => userController.getAll(req, res, next));
routes.post("/", (req, res, next) => userController.create(req, res, next));
routes.get("/:id", (req, res, next) => userController.getById(req, res, next));
routes.get("/email/:email", (req, res, next) => userController.getByEmail(req, res, next));
routes.put("/:id", (req, res, next) => userController.update(req, res, next));
routes.delete("/:id", (req, res, next) => userController.delete(req, res, next));

export default routes;
