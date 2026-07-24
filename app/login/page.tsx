import styles from "./page.module.css";

export default function LoginPage() {
  return (
    <main className={styles.container}>
      <div className={styles.loginCard}>

        <div className={styles.header}>
          <div className={styles.icon}>🍽️</div>
          <h1 className={styles.title}>食事管理表</h1>
          <p className={styles.description}>毎日の食事を記録しよう</p>
        </div>

        <form className={styles.form}>

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
            />
          </div>

          <button
            type="submit"
            className={styles.button}
          >
            ログイン
          </button>

        </form>

        <p className={styles.signup}>
          アカウントをお持ちでない方は{" "}
          <a href="#" className={styles.signupLink}>
            新規登録
          </a>
        </p>

      </div>
    </main>
  );
}