import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    

    if (!user) {
      return Response.json(
        {
          message: "ログインが必要です。",
        },
        { status: 401 },
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
      !mainDish.trim()
    ) {
      return Response.json(
        {
          message: "食事日、食事区分、主菜を入力してください。",
        },
        { status: 400 },
      );
    }

    const result = await db.query(
      `
        INSERT INTO meals (
          user_id,
          meal_type_id,
          meal_date,
          main_dish,
          side_dish,
          soup,
          memo
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `,
      [
        user.userId,
        mealTypeId,
        mealDate,
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
      ],
    );

    return Response.json(
      {
        message: "食事を登録しました。",
        mealId: result.rows[0].id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Meal registration error:", error);

    return Response.json(
      {
        message: "食事の登録中にエラーが発生しました。",
      },
      { status: 500 },
    );
  }
}


export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        { message: "ログインが必要です。" },
        { status: 401 },
      );
    }

    const result = await db.query(
  `
    SELECT
      meals.id,
      TO_CHAR(meals.meal_date, 'YYYY-MM-DD') AS meal_date,
      meals.main_dish,
      meals.side_dish,
      meals.soup,
      meals.memo,
      meal_types.name AS meal_type
    FROM meals
    INNER JOIN meal_types
      ON meals.meal_type_id = meal_types.id
    WHERE meals.user_id = $1
    ORDER BY meals.meal_date DESC, meals.id DESC
  `,
  [user.userId],
);

    return Response.json(
      { meals: result.rows },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "食事一覧の取得に失敗しました。" },
      { status: 500 },
    );
  }
}