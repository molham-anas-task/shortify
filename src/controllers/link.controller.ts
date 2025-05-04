import { Request, Response } from "express";
import { LinkService } from "../services/link.service";
import { ClickService } from "../services/click.service";
import { z } from "zod";

export class LinkController {
  static shortenSchema = z.object({
    originalUrl: z.string().url({ message: "Invalid URL format" }),
  });

  static async shorten(req: Request, res: Response): Promise<void> {
    try {
      const parseResult = LinkController.shortenSchema.safeParse(req.body);

      if (!parseResult.success) {
        res
          .status(400)
          .json({ error: parseResult.error.flatten().fieldErrors });
        return;
      }

      const { originalUrl } = parseResult.data;
      const baseUrl = process.env.BASE_URL || "http://localhost:3000";

      const link = await LinkService.shortenUrl(originalUrl, req.user?.id);

      res.status(201).json({
        ...link,
        shortUrl: `${baseUrl}/${link.shortCode}`,
      });
    } catch (error) {
      console.error("Shorten Error:", error);
      res.status(500).json({ error: "Failed to create short link" });
    }
  }

  static async redirect(req: Request, res: Response): Promise<void> {
    try {
      const { shortCode } = req.params;
      const link = await LinkService.getLinkByShortCode(shortCode);

      if (!link) {
        res.status(404).json({ error: "Short link not found" });
        return;
      }
      await ClickService.createClick(link.id);
      res.redirect(link.originalUrl);
    } catch (error) {
      res.status(500).json({ error: "Redirection failed" });
    }
  }

  static async getUserLinks(req: Request, res: Response): Promise<void> {
    try {
      const links = await LinkService.getUserLinks(req.user!.id);
      res.json(links);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user links" });
    }
  }

  static async getClickCount(req: Request, res: Response): Promise<void> {
    try {
      const linkId = parseInt(req.params.id, 10);
      if (isNaN(linkId)) {
        res.status(400).json({ error: "Invalid link ID" });
        return;
      }

      const result = await LinkService.getClickCount(linkId);
      res.json({ count: result });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch click count" });
    }
  }

  static async deleteLink(req: Request, res: Response): Promise<void> {
    try {
      const linkId = parseInt(req.params.id, 10);
      if (isNaN(linkId)) {
        res.status(400).json({ error: "Invalid link ID" });
        return;
      }

      await LinkService.deleteLink(linkId, req.user!.id);
      res.status(200).json({ message: "Link deleted successfully" });
    } catch (error) {
      console.error("Delete Link Error:", error);
      res.status(500).json({ error: "Failed to delete link" });
    }
  }
}
