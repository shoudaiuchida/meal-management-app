import bcrypt from "bcrypt";

import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, user_name, password } = body;

    if (
      typeof email !== "string" ||
      typeof user_name !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !user_name.trim() ||
      !password
    ) {
      return Response.json(
        {
          message:
            "メールアドレス、ユーザー名、パスワードを入力してください。",
        },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedUserName = user_name.trim();

    const existingUser = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail],
    );

    if (existingUser.rows.length > 0) {
      return Response.json(
        {
          message: "登録できませんでした。入力内容をご確認ください。",
        },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db.query(
      `
        INSERT INTO users (email, user_name, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, email, user_name, role, created_at
      `,
      [normalizedEmail, trimmedUserName, passwordHash],
    );

    return Response.json(
      {
        message: "ユーザー登録に成功しました。",
        user: result.rows[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);

    return Response.json(
      {
        message: "ユーザー登録中にエラーが発生しました。",
      },
      { status: 500 },
    );
  }
}