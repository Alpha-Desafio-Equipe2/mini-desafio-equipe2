import { Router } from "express";
import { UserController } from "./UserController.js";

const router = Router();
const controller = new UserController();

router.post("/", controller.create);
router.get("/", controller.getAll);

export default router;
