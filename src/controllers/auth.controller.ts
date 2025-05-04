import { Request, Response } from "express";
import { z } from "zod";
import { AuthService } from "../services/auth.service";

const authSchema = z.object({
  userName: z.string().min(3),
  password: z.string().min(6),
});

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    const parsed = authSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      return;
    }

    const { userName, password } = parsed.data;

    try {
      const { token, user } = await AuthService.register(userName, password);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(201).json({
        message: "Registered successfully",
        user: { id: user.id, userName: user.userName },
        token,
      });
    } catch (err: any) {
      res.status(409).json({ error: err.message });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    const parsed = authSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      return;
    }

    const { userName, password } = parsed.data;

    try {
      const { token, user } = await AuthService.login(userName, password);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({
        message: "Logged in successfully",
        user: { id: user.id, userName: user.userName },
        token,
      });
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  }

  static logout(req: Request, res: Response): void {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.json({ message: "Logged out successfully" });
  }
}
