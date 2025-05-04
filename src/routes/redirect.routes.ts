import { Router } from "express";
import { LinkController } from "../controllers/link.controller";

const router = Router();

router.get("/:shortCode", LinkController.redirect);

export default router;
