import { Router } from "express";
import EntityTypes from "@controllers/entityTypes";

const router = Router();

router.get("/", EntityTypes.getAll);
router.get("/:id", EntityTypes.getById);
router.post("/", EntityTypes.createRecord);
router.put("/:id", EntityTypes.updateRecord);
router.delete("/:id", EntityTypes.deleteRecord);
router.options("/", EntityTypes.options);

router.get("/:id/:associationName(action-types)", EntityTypes.getAssociation);

export default router;
