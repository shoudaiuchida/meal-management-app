import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

type AccessTokenPayload = {
  userId: number;
  role: string;
};

export async function getCurrentUser(): Promise<AccessTokenPayload | null> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return null;
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRETが設定されていません");
  }

  try {
    const payload = jwt.verify(
      accessToken,
      jwtSecret
    ) as AccessTokenPayload;

    return {
      userId: payload.userId,
      role: payload.role,
    };
  } catch {
    return null;
  }
}