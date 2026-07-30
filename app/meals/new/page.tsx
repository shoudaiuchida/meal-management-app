"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function NewMealPage() {
  const [mealDate, setMealDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });
  const [mealTypeId, setMealTypeId] = useState("");
  const [mainDish, setMainDish] = useState("");
  const [sideDish, setSideDish] = useState("");
  const [soup, setSoup] = useState("");
  const [memo, setMemo] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/meals", {
        method: "POST",
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

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message ?? "食事の登録に失敗しました。");
        return;
      }

      setMessage("食事を登録しました。");
      setMainDish("");
      setSideDish("");
      setSoup("");
      setMemo("");
    } catch (error) {
      console.error("Meal registration failed:", error);
      setMessage("通信に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f0fdf4] px-4 py-10 text-[#334155] sm:px-6">
      <section className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-6 shadow-[0_12px_32px_rgba(51,65,85,0.12)] sm:p-10">
        <nav
          aria-label="戻るメニュー"
          className="mb-8 grid gap-3 sm:grid-cols-2"
        >
          <Link
            href="/dashboard"
            className="flex items-center justify-center rounded-xl bg-[#dcfce7] px-4 py-3 text-sm font-bold text-[#166534] no-underline transition hover:brightness-95"
          >
            ダッシュボードに戻る
          </Link>
          <Link
            href="/meals"
            className="flex items-center justify-center rounded-xl bg-[#ffedd5] px-4 py-3 text-sm font-bold text-[#9a3412] no-underline transition hover:brightness-95"
          >
            食事一覧に戻る
          </Link>
        </nav>

        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">🍽️</div>
          <h1 className="m-0 text-3xl font-bold sm:text-4xl">食事登録</h1>
          <p className="mt-3 text-sm text-[#64748b] sm:text-base">
            今日の食事を記録しましょう
          </p>
        </div>

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
              <option value="">選択してください</option>
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

          {message && (
            <p
              role="status"
              aria-live="polite"
              className="m-0 rounded-xl bg-[#f0fdf4] px-4 py-3 text-center text-sm font-semibold text-[#166534]"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full cursor-pointer rounded-xl border-0 bg-[#4ade80] px-4 py-3.5 text-base font-bold text-[#14532d] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "登録中..." : "登録する"}
          </button>
        </form>
      </section>
    </main>
  );
}
