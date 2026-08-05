"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Meal = {
  id: number;
  meal_date: string;
  meal_type: string;
  main_dish: string;
  side_dish: string | null;
  soup: string | null;
  memo: string | null;
};

type MealsResponse = {
  meals?: Meal[];
  isGuest?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  message?: string;
};

async function fetchMeals(page: number) {
  const response = await fetch(`/api/meals?page=${page}`);
  const data: MealsResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "食事一覧の取得に失敗しました。");
  }

  return {
    meals: data.meals ?? [],
    isGuest: data.isGuest ?? false,
    currentPage: data.currentPage ?? page,
    totalPages: Math.max(data.totalPages ?? 1, 1),
    totalCount: data.totalCount ?? data.meals?.length ?? 0,
  };
}

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingMealId, setDeletingMealId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function loadMeals() {
      try {
        const result = await fetchMeals(currentPage);
        setMeals(result.meals);
        setIsGuest(result.isGuest);
        setCurrentPage(result.currentPage);
        setTotalPages(result.totalPages);
        setTotalCount(result.totalCount);
      } catch (error) {
        console.error("Meal list request failed:", error);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "通信に失敗しました。もう一度お試しください。",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadMeals();
  }, [currentPage]);

  function handlePageChange(page: number) {
    setErrorMessage("");
    setIsLoading(true);
    setCurrentPage(page);
  }

  async function handleDelete(mealId: number) {
    const shouldDelete = window.confirm("この食事を削除しますか？");

    if (!shouldDelete) {
      return;
    }

    setErrorMessage("");
    setDeletingMealId(mealId);

    try {
      const response = await fetch(`/api/meals/${mealId}`, {
        method: "DELETE",
      });
      const data: MealsResponse = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message ?? "食事の削除に失敗しました。");
        return;
      }

      const result = await fetchMeals(currentPage);

      if (result.meals.length === 0 && currentPage > 1) {
        handlePageChange(currentPage - 1);
        return;
      }

      setMeals(result.meals);
      setIsGuest(result.isGuest);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error("Meal deletion failed:", error);
      setErrorMessage("通信に失敗しました。もう一度お試しください。");
    } finally {
      setDeletingMealId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f0fdf4] px-4 py-10 text-[#334155] sm:px-6">
      <section className="mx-auto w-full max-w-4xl">
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <Link
            href={isGuest ? "/" : "/dashboard"}
            className="flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#475569] no-underline shadow-sm transition hover:bg-[#f8fafc]"
          >
            ホームに戻る
          </Link>
          <Link
            href="/meals/new"
            className="flex items-center justify-center rounded-xl bg-[#fb923c] px-4 py-3 text-sm font-bold text-[#7c2d12] no-underline shadow-sm transition hover:brightness-95"
          >
            食事を追加
          </Link>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-[0_12px_32px_rgba(51,65,85,0.12)] sm:p-10">
          <div className="mb-8 text-center">
            <div className="mb-3 text-5xl">🍽️</div>
            <h1 className="m-0 text-3xl font-bold sm:text-4xl">食事一覧</h1>
            <p className="mt-3 text-sm text-[#64748b] sm:text-base">
              登録した食事を確認できます
            </p>
          </div>

          {isLoading && (
            <p role="status" className="py-12 text-center text-[#64748b]">
              読み込み中...
            </p>
          )}

          {!isLoading && errorMessage && (
            <p
              role="alert"
              className="rounded-xl bg-[#fef2f2] px-4 py-4 text-center font-semibold text-[#b91c1c]"
            >
              {errorMessage}
            </p>
          )}

          {!isLoading && !errorMessage && isGuest && (
            <p className="mb-5 rounded-xl bg-[#fff7ed] px-4 py-3 text-center text-sm font-semibold text-[#9a3412]">
              現在はサンプルデータを表示しています
            </p>
          )}

          {!isLoading && !errorMessage && meals.length === 0 && (
            <p className="rounded-xl bg-[#f8fafc] px-4 py-12 text-center text-[#64748b]">
              登録されている食事はありません。
            </p>
          )}

          {!isLoading && meals.length > 0 && (
            <div className="flex flex-col gap-5">
              {meals.map((meal) => {
                const mealDate = meal.meal_date
                  .slice(0, 10)
                  .replaceAll("-", "/");

                return (
                  <article
                    key={meal.id}
                    className="rounded-2xl border border-[#dcfce7] bg-[#fafffb] p-5 sm:p-6"
                  >
                    <div className="mb-5 flex flex-col gap-2 border-b border-[#dcfce7] pb-4 sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="m-0 text-xl font-bold text-[#334155]">
                        {mealDate}
                      </h2>
                      <div className="flex items-center gap-3">
                        <span className="w-fit rounded-full bg-[#4ade80] px-4 py-1.5 text-sm font-bold text-[#14532d]">
                          {meal.meal_type}
                        </span>
                        {!isGuest && (
                          <>
                            <Link
                              href={`/meals/${meal.id}/edit`}
                              className="rounded-lg border border-[#fdba74] bg-[#fff7ed] px-3 py-1.5 text-sm font-bold text-[#9a3412] no-underline transition hover:bg-[#ffedd5]"
                            >
                              編集
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(meal.id)}
                              disabled={deletingMealId !== null}
                              className="cursor-pointer rounded-lg border border-[#fca5a5] bg-white px-3 py-1.5 text-sm font-bold text-[#b91c1c] transition hover:bg-[#fef2f2] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deletingMealId === meal.id
                                ? "削除中..."
                                : "削除"}
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <dl className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="mb-1 text-sm font-bold text-[#64748b]">
                          主菜
                        </dt>
                        <dd className="m-0">{meal.main_dish}</dd>
                      </div>
                      <div>
                        <dt className="mb-1 text-sm font-bold text-[#64748b]">
                          副菜
                        </dt>
                        <dd className="m-0">{meal.side_dish ?? "未登録"}</dd>
                      </div>
                      <div>
                        <dt className="mb-1 text-sm font-bold text-[#64748b]">
                          汁物
                        </dt>
                        <dd className="m-0">{meal.soup ?? "未登録"}</dd>
                      </div>
                      <div>
                        <dt className="mb-1 text-sm font-bold text-[#64748b]">
                          メモ
                        </dt>
                        <dd className="m-0 whitespace-pre-wrap">
                          {meal.memo ?? "未登録"}
                        </dd>
                      </div>
                    </dl>
                  </article>
                );
              })}
            </div>
          )}

          {!isLoading && !errorMessage && totalCount > 0 && (
            <div className="mt-8 flex flex-col items-center gap-4 border-t border-[#e2e8f0] pt-6 sm:flex-row sm:justify-between">
              <p className="m-0 text-sm text-[#64748b]">全{totalCount}件</p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="cursor-pointer rounded-lg border border-[#cbd5e1] bg-white px-4 py-2 text-sm font-bold text-[#475569] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  前へ
                </button>

                <span className="min-w-20 text-center text-sm font-semibold text-[#334155]">
                  {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="cursor-pointer rounded-lg border border-[#cbd5e1] bg-white px-4 py-2 text-sm font-bold text-[#475569] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  次へ
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
