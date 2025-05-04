import { Router } from "express";
import { LinkController } from "../controllers/link.controller";
import { authMiddleware } from "../middlewares/auth";
import { optionalAuth } from "../middlewares/optionalAuth";

const router = Router();

router.post("/shorten", optionalAuth, LinkController.shorten);

router.get("/user", authMiddleware, LinkController.getUserLinks);

router.get("/clicks/:id", authMiddleware, LinkController.getClickCount);

router.delete("/:id", authMiddleware, LinkController.deleteLink);

export default router;
