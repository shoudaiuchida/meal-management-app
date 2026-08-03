import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
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
        SELECT
          id,
          TO_CHAR(meal_date, 'YYYY-MM-DD') AS meal_date,
          meal_type_id,
          main_dish,
          side_dish,
          soup,
          memo
        FROM meals
        WHERE id = $1
          AND user_id = $2
      `,
      [mealId, user.userId],
    );

    if (result.rows.length === 0) {
      return Response.json(
        { message: "食事データが見つかりません" },
        { status: 404 },
      );
    }

    return Response.json(
      { meal: result.rows[0] },
      { status: 200 },
    );
  } catch (error) {
    console.error("食事取得エラー:", error);

    return Response.json(
      { message: "食事データの取得に失敗しました" },
      { status: 500 },
    );
  }
}

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

export async function PUT(
  request: Request,
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

    const body = await request.json();
    const {
      mealDate,
      mealTypeId,
      mainDish,
      sideDish,
      soup,
      memo,
    } = body;

    if (
      typeof mealDate !== "string" ||
      typeof mealTypeId !== "number" ||
      typeof mainDish !== "string" ||
      !mealDate ||
      !Number.isInteger(mealTypeId) ||
      mealTypeId < 1 ||
      mealTypeId > 3 ||
      !mainDish.trim()
    ) {
      return Response.json(
        { message: "食事日、食事区分、主菜を入力してください" },
        { status: 400 },
      );
    }

    const result = await db.query(
      `
        UPDATE meals
        SET
          meal_date = $1,
          meal_type_id = $2,
          main_dish = $3,
          side_dish = $4,
          soup = $5,
          memo = $6,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
          AND user_id = $8
        RETURNING id
      `,
      [
        mealDate,
        mealTypeId,
        mainDish.trim(),
        typeof sideDish === "string" && sideDish.trim()
          ? sideDish.trim()
          : null,
        typeof soup === "string" && soup.trim()
          ? soup.trim()
          : null,
        typeof memo === "string" && memo.trim()
          ? memo.trim()
          : null,
        mealId,
        user.userId,
      ],
    );

    if (result.rows.length === 0) {
      return Response.json(
        { message: "食事データが見つかりません" },
        { status: 404 },
      );
    }

    return Response.json(
      { message: "食事を更新しました" },
      { status: 200 },
    );
  } catch (error) {
    console.error("食事更新エラー:", error);

    return Response.json(
      { message: "食事の更新に失敗しました" },
      { status: 500 },
    );
  }
}
