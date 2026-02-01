import { Router } from "express";
import { UserController } from "./UserController.js";
import { Validators } from "../../shared/utils/validators.js";
import { authorizeRoles } from "../auth/AuthMiddleware.js";
import { UserRole } from "./domain/enums/UserRole.js";

const router = Router();
const controller = new UserController();

router.post("/",
  authorizeRoles(UserRole.ADMIN),
  Validators.validateNameMiddleware,
  Validators.validateEmailMiddleware,
  Validators.validateCPFMiddleware,
  Validators.validatePasswordMiddleware,
  controller.create
);

router.get("/email/:email",
  authorizeRoles(UserRole.ADMIN, UserRole.PHARMACIST),
  Validators.validateEmailParamMiddleware,
  controller.getByEmail
);

router.get("/:id",
  authorizeRoles(UserRole.ADMIN, UserRole.PHARMACIST),
  Validators.validateIdParamMiddleware,
  controller.getById
);

router.get("/",
  authorizeRoles(UserRole.ADMIN, UserRole.PHARMACIST),
  controller.getAll);

router.put("/:id",
  authorizeRoles(UserRole.ADMIN, UserRole.PHARMACIST),
  Validators.validateIdParamMiddleware,
  controller.update
);

router.delete("/:id",
  authorizeRoles(UserRole.ADMIN),
  Validators.validateIdParamMiddleware,
  controller.delete
);

export default router;
