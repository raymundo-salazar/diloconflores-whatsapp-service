import { Router } from "express";
import { healthCheck, liveness, readiness } from "@controllers/health";

const router = Router();

router.get("/", healthCheck);
router.get("/liveness", liveness);
router.get("/readiness", readiness);

export default router;
