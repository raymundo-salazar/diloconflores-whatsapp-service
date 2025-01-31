import { Router } from "express";
import AuthController from "@controllers/auth";

const router = Router();

router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", AuthController.logout);

export default router;
