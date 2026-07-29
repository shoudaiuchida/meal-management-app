"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message ?? "ログインに失敗しました。");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Login request failed:", error);

      setErrorMessage(
        "通信に失敗しました。もう一度お試しください。",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.icon}>🍽️</div>

          <h1 className={styles.title}>
            食事管理表
          </h1>

          <p className={styles.description}>
            毎日の食事を記録しよう
          </p>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <div className={styles.field}>
            <label
              htmlFor="email"
              className={styles.label}
            >
              メールアドレス
            </label>

            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.field}>
            <label
              htmlFor="password"
              className={styles.label}
            >
              パスワード
            </label>

            <input
              id="password"
              name="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              required
            />
          </div>

          {errorMessage && (
            <p role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "ログイン中..."
              : "ログイン"}
          </button>
        </form>

        <p className={styles.signupText}>
          アカウントをお持ちでない方は{" "}

          <Link
            href="/signup"
            className={styles.signupLink}
          >
            新規登録
          </Link>
        </p>
      </div>
    </main>
  );
}