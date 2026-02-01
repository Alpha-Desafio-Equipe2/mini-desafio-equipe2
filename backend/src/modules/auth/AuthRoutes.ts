import { Router } from "express";
import { AuthController } from "./AuthController.js";
import { Validators } from "../../shared/utils/validators.js";

const router = Router();
const controller = new AuthController();

router.post("/login",
  Validators.validateEmailMiddleware,
  controller.login);

export default router;
