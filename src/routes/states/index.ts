import { Router } from "express";
import StatesController from "@controllers/states";

const router = Router();

// Ruta para crear un usuario admin
router.get("/", StatesController.getAll);
router.options("/", StatesController.options);
router.post("/", StatesController.createRecord);
router.get("/:id", StatesController.getById);
router.put("/:id", StatesController.updateRecord);
router.delete("/:id", StatesController.deleteRecord);

router.get("/:id/:associationName(cities|country|city)", StatesController.getAssociation);
router.post("/:id/:associationName(cities|country|city)", StatesController.setAssociation);
router.delete("/:id/:associationName(cities|country|city)", StatesController.deleteAssociation);

export default router;
