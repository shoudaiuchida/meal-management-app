import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <div className={styles.header}>
          <span className={styles.icon}>🍽️</span>
          <h1 className={styles.title}>Meal Tracker</h1>
          <p className={styles.description}>
            毎日の食事をかんたんに記録・確認できます
          </p>
        </div>

        <div className={styles.menu}>
          <Link href="/meals" className={styles.mealListButton}>
            食事一覧
          </Link>
          <Link href="/meals/new" className={styles.mealInputButton}>
            食事入力
          </Link>
        </div>

        <nav className={styles.accountLinks} aria-label="アカウントメニュー">
          <Link href="/login" className={styles.accountLink}>
            ログイン
          </Link>
          <Link href="/signup" className={styles.accountLink}>
            新規登録
          </Link>
        </nav>
      </section>
    </main>
  );
}
