import { Router } from "express";
import { AuthController } from "./AuthController.js";

const routes = Router();
const authController = new AuthController();

routes.post("/login", (req, res, next) => authController.login(req, res, next));
routes.post("/register", (req, res, next) => authController.register(req, res, next));

export default routes;
