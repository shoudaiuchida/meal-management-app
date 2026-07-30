import crypto from "node:crypto";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

import styles from "./page.module.css";

async function logout() {
  "use server";

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (sessionId) {
    const sessionIdHash = crypto
      .createHash("sha256")
      .update(sessionId)
      .digest("hex");

    await db.query(
      `
        DELETE FROM sessions
        WHERE session_id_hash = $1
      `,
      [sessionIdHash],
    );
  }

  cookieStore.delete("session_id");
  redirect("/login");
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <header className={styles.header}>
          <div className={styles.topBar}>
            <Link href="/dashboard" className={styles.logo}>
              <span className={styles.logoIcon}>🍽️</span>
              Meal Tracker
            </Link>

            <form action={logout}>
              <button type="submit" className={styles.logoutLink}>
                ログアウト
              </button>
            </form>
          </div>

          <div className={styles.introduction}>
            <h1 className={styles.title}>今日の食事を管理しましょう</h1>
            <p className={styles.description}>
              食事の記録や、これまでの食事を確認できます
            </p>
          </div>
        </header>

        <div className={styles.menu}>
          <Link href="/meals" className={styles.mealListButton}>
            <span className={styles.buttonIcon}>📋</span>
            食事一覧
          </Link>

          <Link href="/meals/new" className={styles.mealInputButton}>
            <span className={styles.buttonIcon}>✏️</span>
            食事入力
          </Link>
        </div>
      </section>
    </main>
  );
}