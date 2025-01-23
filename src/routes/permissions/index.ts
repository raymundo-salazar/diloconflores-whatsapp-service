import { Router } from "express";
import PermissionsController from "@controllers/permissions";

const router = Router();

router.get("/", PermissionsController.getAll);
router.get("/:id", PermissionsController.getById);
router.post("/", PermissionsController.createRecord);
router.put("/:id", PermissionsController.updateRecord);
router.delete("/:id", PermissionsController.deleteRecord);
router.options("/", PermissionsController.options);

export default router;
