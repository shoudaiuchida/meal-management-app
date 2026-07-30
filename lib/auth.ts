import crypto from "node:crypto";
import { cookies } from "next/headers";

import { db } from "@/lib/db";

type CurrentUser = {
  userId: number;
  role: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    return null;
  }

  const sessionIdHash = crypto
    .createHash("sha256")
    .update(sessionId)
    .digest("hex");

  const result = await db.query(
    `
      SELECT
        users.id AS user_id,
        users.role
      FROM sessions
      INNER JOIN users
        ON sessions.user_id = users.id
      WHERE sessions.session_id_hash = $1
        AND sessions.expires_at > CURRENT_TIMESTAMP
      LIMIT 1
    `,
    [sessionIdHash],
  );

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];

  return {
    userId: user.user_id,
    role: user.role,
  };
}