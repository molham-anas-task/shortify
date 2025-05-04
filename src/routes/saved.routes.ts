import { Router } from "express";
import { SavedController } from "../controllers/saved.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.post("/:linkId", authMiddleware, SavedController.save);
router.delete("/:linkId", authMiddleware, SavedController.unsave);
router.get("/", authMiddleware, SavedController.getSaved);

export default router;
