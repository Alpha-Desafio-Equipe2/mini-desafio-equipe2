import { Router } from "express";
import { SaleController } from "./SaleController.js";

const router = Router();
const controller = new SaleController();

router.post("/", controller.create);
router.get("/", controller.getAll);

export default router;
