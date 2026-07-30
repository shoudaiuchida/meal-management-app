import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import crypto from "node:crypto";

import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return Response.json(
        {
          message: "メールアドレスとパスワードを入力してください。",
        },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await db.query(
      `
        SELECT id, email, user_name, password_hash, role
        FROM users
        WHERE email = $1
      `,
      [normalizedEmail],
    );

    if (result.rows.length === 0) {
      return Response.json(
        {
          message: "メールアドレスまたはパスワードが正しくありません。",
        },
        { status: 401 },
      );
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      return Response.json(
        {
          message: "メールアドレスまたはパスワードが正しくありません。",
        },
        { status: 401 },
      );
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRETが設定されていません。");
    }

const accessToken = jwt.sign(
  {
    userId: user.id,
    role: user.role,
  },
  jwtSecret,
  {
    algorithm: "HS256",
    expiresIn: "15m",
  },
);

const refreshToken = crypto.randomBytes(64).toString("hex");

const refreshTokenExpiresAt = new Date(
  Date.now() + 7 * 24 * 60 * 60 * 1000,
);

const refreshTokenHash = crypto
  .createHash("sha256")
  .update(refreshToken)
  .digest("hex");

await db.query(
  `
    INSERT INTO refresh_tokens (
      user_id,
      token_hash,
      expires_at
    )
    VALUES ($1, $2, $3)
  `,
  [user.id, refreshTokenHash, refreshTokenExpiresAt],
);

const cookieStore = await cookies();

   cookieStore.set("access_token", accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 15,
});

cookieStore.set("refresh_token", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
});

    return Response.json(
      {
        message: "ログインに成功しました。",
        user: {
          id: user.id,
          email: user.email,
          user_name: user.user_name,
          role: user.role,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login error:", error);

    return Response.json(
      {
        message: "ログイン処理中にエラーが発生しました。",
      },
      { status: 500 },
    );
  }
}