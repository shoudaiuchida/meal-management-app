import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        { message: "ログインが必要です" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const mealId = Number(id);

    if (!Number.isInteger(mealId) || mealId <= 0) {
      return Response.json(
        { message: "食事IDが正しくありません" },
        { status: 400 },
      );
    }

    const result = await db.query(
      `
        DELETE FROM meals
        WHERE id = $1
          AND user_id = $2
        RETURNING id
      `,
      [mealId, user.userId],
    );

    if (result.rowCount === 0) {
      return Response.json(
        { message: "削除する食事が見つかりません" },
        { status: 404 },
      );
    }

    return Response.json(
      { message: "食事を削除しました" },
      { status: 200 },
    );
  } catch (error) {
    console.error("食事削除エラー:", error);

    return Response.json(
      { message: "食事の削除に失敗しました" },
      { status: 500 },
    );
  }
}