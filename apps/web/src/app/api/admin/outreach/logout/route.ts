import { NextResponse } from "next/server";
import { OUTREACH_SESSION_COOKIE } from "@/lib/outreach/admin";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/outreach", request.url), { status: 303 });
  response.cookies.set(OUTREACH_SESSION_COOKIE, "", { httpOnly: true, maxAge: 0, path: "/", sameSite: "strict" });
  return response;
}
