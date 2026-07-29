import Link from "next/link";
import styles from "./page.module.css";

export default function DashboardPage() {
  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <header className={styles.header}>
          <div className={styles.topBar}>
            <Link href="/dashboard" className={styles.logo}>
              <span className={styles.logoIcon}>🍽️</span>
              Meal Tracker
            </Link>

            <Link href="/login" className={styles.logoutLink}>
              ログアウト
            </Link>
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
