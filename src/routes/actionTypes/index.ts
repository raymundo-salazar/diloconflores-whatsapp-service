import { Router } from "express";
import ActionTypesController from "@controllers/actionTypes";

const router = Router();

router.get("/", ActionTypesController.getAll);
router.get("/:id", ActionTypesController.getById);
router.post("/", ActionTypesController.createRecord);
router.put("/:id", ActionTypesController.updateRecord);
router.delete("/:id", ActionTypesController.deleteRecord);
router.options("/", ActionTypesController.options);

router.get("/:id/:associationName(permission)", ActionTypesController.getAssociation);

export default router;
