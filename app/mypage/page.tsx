"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  email: string;
  user_name: string;
};

type MyPageResponse = {
  user?: User;
  message?: string;
};

export default function MyPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/mypage");
        const data: MyPageResponse = await response.json();

        if (!response.ok || !data.user) {
          setErrorMessage(
            data.message ?? "ユーザー情報の取得に失敗しました。",
          );
          return;
        }

        setEmail(data.user.email);
        setUserName(data.user.user_name);
        setIsUserLoaded(true);
      } catch (error) {
        console.error("My page request failed:", error);
        setErrorMessage("通信に失敗しました。もう一度お試しください。");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsUpdating(true);

    try {
      const response = await fetch("/api/mypage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          userName,
        }),
      });
      const data: MyPageResponse = await response.json();

      if (!response.ok || !data.user) {
        setErrorMessage(
          data.message ?? "プロフィールの更新に失敗しました。",
        );
        return;
      }

      setEmail(data.user.email);
      setUserName(data.user.user_name);
      setSuccessMessage(data.message ?? "プロフィールを更新しました。");
    } catch (error) {
      console.error("Profile update failed:", error);
      setErrorMessage("通信に失敗しました。もう一度お試しください。");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete() {
    const shouldDelete = window.confirm("本当に退会しますか？");

    if (!shouldDelete) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsDeleting(true);

    try {
      const response = await fetch("/api/mypage", {
        method: "DELETE",
      });
      const data: MyPageResponse = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message ?? "退会処理に失敗しました。");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Account deletion failed:", error);
      setErrorMessage("通信に失敗しました。もう一度お試しください。");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f0fdf4] px-4 py-10 text-[#334155] sm:px-6">
      <section className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-6 shadow-[0_12px_32px_rgba(51,65,85,0.12)] sm:p-10">
        <Link
          href="/dashboard"
          className="mb-8 flex items-center justify-center rounded-xl bg-[#dcfce7] px-4 py-3 text-sm font-bold text-[#166534] no-underline transition hover:brightness-95"
        >
          ダッシュボードに戻る
        </Link>

        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">👤</div>
          <h1 className="m-0 text-3xl font-bold sm:text-4xl">マイページ</h1>
          <p className="mt-3 text-sm text-[#64748b] sm:text-base">
            登録情報の確認と変更ができます
          </p>
        </div>

        {isLoading && (
          <p role="status" className="py-12 text-center text-[#64748b]">
            読み込み中...
          </p>
        )}

        {!isLoading && !isUserLoaded && (
          <p
            role="alert"
            className="rounded-xl bg-[#fef2f2] px-4 py-4 text-center font-semibold text-[#b91c1c]"
          >
            {errorMessage}
          </p>
        )}

        {!isLoading && isUserLoaded && (
          <form className="flex flex-col gap-5" onSubmit={handleUpdate}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-xl border border-[#cbd5e1] bg-white px-4 py-3 text-base outline-none transition focus:border-[#4ade80] focus:ring-3 focus:ring-[#4ade80]/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="userName" className="text-sm font-semibold">
                ユーザー名
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                required
                className="w-full rounded-xl border border-[#cbd5e1] bg-white px-4 py-3 text-base outline-none transition focus:border-[#4ade80] focus:ring-3 focus:ring-[#4ade80]/20"
              />
            </div>

            {successMessage && (
              <p
                role="status"
                className="m-0 rounded-xl bg-[#f0fdf4] px-4 py-3 text-center text-sm font-semibold text-[#166534]"
              >
                {successMessage}
              </p>
            )}

            {errorMessage && (
              <p
                role="alert"
                className="m-0 rounded-xl bg-[#fef2f2] px-4 py-3 text-center text-sm font-semibold text-[#b91c1c]"
              >
                {errorMessage}
              </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isUpdating || isDeleting}
                className="cursor-pointer rounded-xl border border-[#fca5a5] bg-white px-4 py-3.5 text-base font-bold text-[#b91c1c] transition hover:bg-[#fef2f2] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "退会処理中..." : "退会"}
              </button>

              <button
                type="submit"
                disabled={isUpdating || isDeleting}
                className="cursor-pointer rounded-xl border-0 bg-[#4ade80] px-4 py-3.5 text-base font-bold text-[#14532d] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdating ? "更新中..." : "更新する"}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
