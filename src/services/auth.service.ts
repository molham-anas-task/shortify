import { createUser, getUserByuserName } from "../repositories/user.repository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export class AuthService {
  static async register(userName: string, password: string) {
    const existing = await getUserByuserName(userName);
    if (existing.length > 0) {
      throw new Error("userName already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({ userName, password: hashedPassword });

    const token = jwt.sign(
      { id: user[0].id, userName: user[0].userName },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    return { token, user: user[0] };
  }

  static async login(userName: string, password: string) {
    const user = await getUserByuserName(userName);
    if (!user.length) {
      throw new Error("Invalid userName");
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { id: user[0].id, userName: user[0].userName },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    return { token, user: user[0] };
  }
}
