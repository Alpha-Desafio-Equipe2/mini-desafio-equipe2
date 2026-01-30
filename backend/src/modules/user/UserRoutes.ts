import { Router } from "express";
import { UserController } from "./UserController.js";

const router = Router();
const controller = new UserController();

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.get("/:email", controller.getByEmail);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
