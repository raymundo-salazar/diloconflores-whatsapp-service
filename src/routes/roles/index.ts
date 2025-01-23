import { Router } from "express";
// import {
//   createRole,
//   getRoles,
//   getRoleById,
//   updateRole,
//   deleteRole,
//   optionsRole,
//   getRolePermissions,
//   setRolePermissions,
//   deleteRolePermissions,
// } from "@controllers/roles";

import RolesController from "@controllers/roles";

const router = Router();

router.get("/", RolesController.getAll);
router.options("/", RolesController.options);
router.post("/", RolesController.createRecord);
router.get("/:id", RolesController.getById);
router.put("/:id", RolesController.updateRecord);
router.delete("/:id", RolesController.deleteRecord);

router.get("/:id/:associationName(permissions)", RolesController.getAssociation);
router.post("/:id/:associationName(permissions)", RolesController.setAssociation);
router.delete("/:id/:associationName(permissions)", RolesController.deleteAssociation);

export default router;
