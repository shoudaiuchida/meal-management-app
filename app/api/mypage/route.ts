import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return Response.json(
      { message: "ログインが必要です" },
      { status: 401 },
    );
  }

  const result = await db.query(
    `
      SELECT
        id,
        email,
        user_name,
        role,
        created_at,
        updated_at
      FROM users
      WHERE id = $1
    `,
    [currentUser.userId],
  );

  if (result.rows.length === 0) {
    return Response.json(
      { message: "ユーザーが見つかりません" },
      { status: 404 },
    );
  }

  return Response.json(
    {
      user: result.rows[0],
    },
    { status: 200 },
  );
}

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return Response.json(
      { message: "ログインが必要です" },
      { status: 401 },
    );
  }

  const body = await request.json();
  const { email, userName } = body;

  if (
    typeof email !== "string" ||
    typeof userName !== "string" ||
    !email.trim() ||
    !userName.trim()
  ) {
    return Response.json(
      { message: "メールアドレスとユーザー名を入力してください" },
      { status: 400 },
    );
  }

  const result = await db.query(
    `
      UPDATE users
      SET
        email = $1,
        user_name = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING
        id,
        email,
        user_name,
        role,
        created_at,
        updated_at
    `,
    [
      email.trim().toLowerCase(),
      userName.trim(),
      currentUser.userId,
    ],
  );

  if (result.rows.length === 0) {
    return Response.json(
      { message: "ユーザーが見つかりません" },
      { status: 404 },
    );
  }

  return Response.json(
    {
      message: "プロフィールを更新しました",
      user: result.rows[0],
    },
    { status: 200 },
  );
}

export async function DELETE() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return Response.json(
      { message: "ログインが必要です" },
      { status: 401 },
    );
  }

  await db.query(
    `
      DELETE FROM sessions
      WHERE user_id = $1
    `,
    [currentUser.userId],
  );

  await db.query(
    `
      DELETE FROM meals
      WHERE user_id = $1
    `,
    [currentUser.userId],
  );

  const result = await db.query(
    `
      DELETE FROM users
      WHERE id = $1
      RETURNING id
    `,
    [currentUser.userId],
  );

  if (result.rows.length === 0) {
    return Response.json(
      { message: "ユーザーが見つかりません" },
      { status: 404 },
    );
  }

  const cookieStore = await cookies();
  cookieStore.delete("session_id");

  return Response.json(
    { message: "退会が完了しました" },
    { status: 200 },
  );
}
