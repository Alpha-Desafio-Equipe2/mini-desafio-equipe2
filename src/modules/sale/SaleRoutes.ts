import { Router } from "express";
import { SaleController } from "./SaleController.js";

const router = Router();
const controller = new SaleController();

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.patch("/:id/confirm", controller.confirm);
router.post("/:id/cancel", controller.cancel);

export default router;
