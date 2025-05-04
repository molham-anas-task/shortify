import {
  saveLink,
  unsaveLink,
  isLinkSaved,
  getSavedLinksWithClickCountByUserId,
} from "../repositories/saved.repository";
import { getLinkById } from "../repositories/link.repository";


export class SavedService {

  static async saveLink(userId: number, linkId: number) {
    const link = await getLinkById(linkId);
    if (!link) {
      throw new Error("Link not found");
    }

    const alreadySaved = await isLinkSaved(userId, linkId);
    if (alreadySaved) return null;

    await saveLink(userId, linkId);

    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    return {
      ...link,
      isSaved: true,
      shortUrl: `${baseUrl}/${link.shortCode}`,
    };
  }


  static async unsaveLink(userId: number, linkId: number) {
    await unsaveLink(userId, linkId);
  }

  static async getUserSavedLinks(userId: number) {
    return getSavedLinksWithClickCountByUserId(userId);
  }
}
