import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    jwt.verify(accessToken, jwtSecret);

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};