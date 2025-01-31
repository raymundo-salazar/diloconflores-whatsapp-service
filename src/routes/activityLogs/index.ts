import { Router } from "express";
import ActivityLogs from "@controllers/activityLogs";

const router = Router();

router.get("/", ActivityLogs.getAll);
router.get("/:id", ActivityLogs.getById);
router.post("/", ActivityLogs.createRecord);
router.put("/:id", ActivityLogs.updateRecord);
router.delete("/:id", ActivityLogs.deleteRecord);
router.options("/", ActivityLogs.options);

router.get(
  "/:id/:associationName(user|action-type|entity-type|session)",
  ActivityLogs.getAssociation
);

export default router;
