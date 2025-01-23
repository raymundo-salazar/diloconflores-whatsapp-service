import { Router } from "express";
import CountriesController from "@controllers/countries";

const router = Router();

// Ruta para crear un usuario admin
router.options("/", CountriesController.options);
router.get("/", CountriesController.getAll);
router.post("/", CountriesController.createRecord);
router.get("/:id", CountriesController.getById);
router.put("/:id", CountriesController.updateRecord);
router.delete("/:id", CountriesController.deleteRecord);

router.get("/:id/:associationName(states)", CountriesController.getAssociation);
router.post("/:id/:associationName(states)", CountriesController.setAssociation);
router.delete("/:id/:associationName(states)", CountriesController.deleteAssociation);

export default router;
