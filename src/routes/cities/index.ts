import { Router } from "express";
import CitiesController from "@controllers/cities";

const router = Router();

// Ruta para crear un usuario admin
router.get("/", CitiesController.getAll);
router.options("/", CitiesController.options);
router.post("/", CitiesController.createRecord);
router.get("/:id", CitiesController.getById);
router.put("/:id", CitiesController.updateRecord);
router.delete("/:id", CitiesController.deleteRecord);

// states
router.get("/:id/:associationName(state)", CitiesController.getAssociation);

export default router;
