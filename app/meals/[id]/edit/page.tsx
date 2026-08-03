"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Meal = {
  meal_date: string;
  meal_type_id: number;
  main_dish: string;
  side_dish: string | null;
  soup: string | null;
  memo: string | null;
};

type MealResponse = {
  meal?: Meal;
  message?: string;
};

export default function EditMealPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const mealId = params.id;

  const [mealDate, setMealDate] = useState("");
  const [mealTypeId, setMealTypeId] = useState("");
  const [mainDish, setMainDish] = useState("");
  const [sideDish, setSideDish] = useState("");
  const [soup, setSoup] = useState("");
  const [memo, setMemo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMealLoaded, setIsMealLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchMeal() {
      try {
        const response = await fetch(`/api/meals/${mealId}`);
        const data: MealResponse = await response.json();

        if (!response.ok || !data.meal) {
          setErrorMessage(
            data.message ?? "食事データの取得に失敗しました。",
          );
          return;
        }

        setMealDate(data.meal.meal_date);
        setMealTypeId(String(data.meal.meal_type_id));
        setMainDish(data.meal.main_dish);
        setSideDish(data.meal.side_dish ?? "");
        setSoup(data.meal.soup ?? "");
        setMemo(data.meal.memo ?? "");
        setIsMealLoaded(true);
      } catch (error) {
        console.error("Meal request failed:", error);
        setErrorMessage("通信に失敗しました。もう一度お試しください。");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMeal();
  }, [mealId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/meals/${mealId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mealDate,
          mealTypeId: Number(mealTypeId),
          mainDish,
          sideDish,
          soup,
          memo,
        }),
      });
      const data: MealResponse = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message ?? "食事の更新に失敗しました。");
        return;
      }

      router.push("/meals");
      router.refresh();
    } catch (error) {
      console.error("Meal update failed:", error);
      setErrorMessage("通信に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f0fdf4] px-4 py-10 text-[#334155] sm:px-6">
      <section className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-6 shadow-[0_12px_32px_rgba(51,65,85,0.12)] sm:p-10">
        <Link
          href="/meals"
          className="mb-8 flex items-center justify-center rounded-xl bg-[#dcfce7] px-4 py-3 text-sm font-bold text-[#166534] no-underline transition hover:brightness-95"
        >
          食事一覧へ
        </Link>

        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">🍽️</div>
          <h1 className="m-0 text-3xl font-bold sm:text-4xl">食事編集</h1>
          <p className="mt-3 text-sm text-[#64748b] sm:text-base">
            登録した食事を編集できます
          </p>
        </div>

        {isLoading && (
          <p role="status" className="py-12 text-center text-[#64748b]">
            読み込み中...
          </p>
        )}

        {!isLoading && !isMealLoaded && (
          <p
            role="alert"
            className="rounded-xl bg-[#fef2f2] px-4 py-4 text-center font-semibold text-[#b91c1c]"
          >
            {errorMessage}
          </p>
        )}

        {!isLoading && isMealLoaded && (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="mealDate" className="text-sm font-semibold">
                食事日
              </label>
              <input
                id="mealDate"
                name="mealDate"
                type="date"
                value={mealDate}
                onChange={(event) => setMealDate(event.target.value)}
                required
                className="w-full rounded-xl border border-[#cbd5e1] bg-white px-4 py-3 text-base outline-none transition focus:border-[#4ade80] focus:ring-3 focus:ring-[#4ade80]/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="mealTypeId" className="text-sm font-semibold">
                食事区分
              </label>
              <select
                id="mealTypeId"
                name="mealTypeId"
                value={mealTypeId}
                onChange={(event) => setMealTypeId(event.target.value)}
                required
                className="w-full rounded-xl border border-[#cbd5e1] bg-white px-4 py-3 text-base outline-none transition focus:border-[#4ade80] focus:ring-3 focus:ring-[#4ade80]/20"
              >
                <option value="1">朝食</option>
                <option value="2">昼食</option>
                <option value="3">夕食</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="mainDish" className="text-sm font-semibold">
                主菜
              </label>
              <input
                id="mainDish"
                name="mainDish"
                type="text"
                value={mainDish}
                onChange={(event) => setMainDish(event.target.value)}
                required
                className="w-full rounded-xl border border-[#cbd5e1] bg-white px-4 py-3 text-base outline-none transition focus:border-[#4ade80] focus:ring-3 focus:ring-[#4ade80]/20"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="sideDish" className="text-sm font-semibold">
                  副菜
                </label>
                <input
                  id="sideDish"
                  name="sideDish"
                  type="text"
                  value={sideDish}
                  onChange={(event) => setSideDish(event.target.value)}
                  className="w-full rounded-xl border border-[#cbd5e1] bg-white px-4 py-3 text-base outline-none transition focus:border-[#4ade80] focus:ring-3 focus:ring-[#4ade80]/20"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="soup" className="text-sm font-semibold">
                  汁物
                </label>
                <input
                  id="soup"
                  name="soup"
                  type="text"
                  value={soup}
                  onChange={(event) => setSoup(event.target.value)}
                  className="w-full rounded-xl border border-[#cbd5e1] bg-white px-4 py-3 text-base outline-none transition focus:border-[#4ade80] focus:ring-3 focus:ring-[#4ade80]/20"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="memo" className="text-sm font-semibold">
                メモ
              </label>
              <textarea
                id="memo"
                name="memo"
                value={memo}
                onChange={(event) => setMemo(event.target.value)}
                rows={4}
                className="w-full resize-y rounded-xl border border-[#cbd5e1] bg-white px-4 py-3 text-base outline-none transition focus:border-[#4ade80] focus:ring-3 focus:ring-[#4ade80]/20"
              />
            </div>

            {errorMessage && (
              <p
                role="alert"
                className="m-0 rounded-xl bg-[#fef2f2] px-4 py-3 text-center text-sm font-semibold text-[#b91c1c]"
              >
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full cursor-pointer rounded-xl border-0 bg-[#4ade80] px-4 py-3.5 text-base font-bold text-[#14532d] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "保存中..." : "保存する"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
