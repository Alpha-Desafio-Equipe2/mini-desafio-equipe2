import { Router } from "express";
import { UserController } from "./UserController.js";
import { Validators } from "../../shared/utils/validators.js";

const router = Router();
const controller = new UserController();

router.post("/",
  Validators.validateNameMiddleware,
  Validators.validateEmailMiddleware,
  Validators.validateCPFMiddleware,
  Validators.validatePasswordMiddleware,
  controller.create
);

router.get("/", controller.getAll);

router.get("/:id",
  Validators.validateIdParamMiddleware,
  controller.getById
);

router.get("/:email",
  Validators.validateEmailParamMiddleware,
  controller.getByEmail
);

router.put("/:id",
  Validators.validateIdParamMiddleware,
  Validators.validateNameMiddleware,
  Validators.validateEmailMiddleware,
  Validators.validateCPFMiddleware,
  controller.update
);

router.delete("/:id",
  Validators.validateIdParamMiddleware,
  controller.delete
);

export default router;
