import { Router } from "express";
import UsersController from "@controllers/users";

const router = Router();

// Ruta para crear un usuario admin
router.get("/", UsersController.getAll);
router.get("/:id", UsersController.getById);
router.post("/", UsersController.createRecord);
router.put("/:id", UsersController.updateRecord);
router.delete("/:id", UsersController.deleteRecord);
router.options("/", UsersController.options);

export default router;
