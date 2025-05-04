import { generateShortCode } from "../utils/shortCode";
import {
  createLink,
  getLinkByShortCode,
  getLinksWithClickCountByUserId,
  getClickCountByLinkId,
  deleteLinkById,
} from "../repositories/link.repository";
export class LinkService {
  static async shortenUrl(originalUrl: string, userId?: number) {
    let shortCode = generateShortCode();

    let [existing] = await getLinkByShortCode(shortCode);
    while (existing) {
      shortCode = generateShortCode();
      [existing] = await getLinkByShortCode(shortCode);
    }

    const [link] = await createLink(
      userId !== undefined
        ? { originalUrl, shortCode, userId }
        : { originalUrl, shortCode },
    );

    return {
      ...link,
      isSaved: false,
    };
  }

  static async getLinkByShortCode(shortCode: string) {
    const [link] = await getLinkByShortCode(shortCode);
    return link;
  }

  static async getUserLinks(userId: number) {
    const links = await getLinksWithClickCountByUserId(userId);
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    return links.map((link) => ({
      ...link,
      isSaved: link.isSaved ?? false,
      clickCount: link.clickCount,
      shortUrl: `${baseUrl}/${link.shortCode}`,
    }));
  }

  static async getClickCount(linkId: number): Promise<number> {
    const [result] = await getClickCountByLinkId(linkId);
    return result?.count ?? 0;
  }

  static async deleteLink(linkId: number, userId: number): Promise<void> {
    await deleteLinkById(linkId, userId);
  }
}
