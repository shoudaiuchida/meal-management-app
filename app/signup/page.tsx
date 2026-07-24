import Link from "next/link";
import styles from "./page.module.css";

export default function SignupPage() {
  return (
    <main className={styles.container}>
      <div className={styles.signupCard}>
        <div className={styles.header}>
          <div className={styles.icon}>🍽️</div>
          <h1 className={styles.title}>食事管理表</h1>
          <p className={styles.description}>毎日の食事記録を始めよう</p>
        </div>

        <form className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              ユーザー名
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmPassword" className={styles.label}>
              パスワード（確認）
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.button}>
            新規登録
          </button>
        </form>

        <p className={styles.loginText}>
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" className={styles.loginLink}>
            ログイン
          </Link>
        </p>
      </div>
    </main>
  );
}