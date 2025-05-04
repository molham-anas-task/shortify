import { Request, Response } from "express";
import { z } from "zod";
import { SavedService } from "../services/saved.service";

export class SavedController {
  static schema = z.object({
    linkId: z.number(),
  });

  static async save(req: Request, res: Response) {
    try {
      const linkId = parseInt(req.params.linkId);
      if (isNaN(linkId)) {
        res.status(400).json({ error: "Invalid link ID" });
        return;
      }

      const saved = await SavedService.saveLink(req.user!.id, linkId);
      if (!saved) {
        res.status(409).json({ message: "Link already saved" });
        return;
      }
      res.status(201).json(saved);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save link" });
    }
  }

  static async unsave(req: Request, res: Response) {
    try {
      const linkId = parseInt(req.params.linkId);
      if (isNaN(linkId)) {
        res.status(400).json({ error: "Invalid link ID" });
        return;
      }

      await SavedService.unsaveLink(req.user!.id, linkId);
      res.status(200).json({ message: "Link unsaved successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to unsave link" });
    }
  }

  static async getSaved(req: Request, res: Response) {
    try {
      const saved = await SavedService.getUserSavedLinks(req.user!.id);
      const baseUrl = process.env.BASE_URL || "http://localhost:3000";

      const fullLinks = saved.map((link) => ({
        ...link,
        shortUrl: `${baseUrl}/${link.shortCode}`,
        clickCount: link.clickCount,
        isSaved:true,
      }));

      res.json(fullLinks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch saved links" });
    }
  }
}
