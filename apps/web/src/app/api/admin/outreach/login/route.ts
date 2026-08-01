import { NextResponse } from "next/server";
import { createOutreachSession, verifyOutreachPassword } from "@/lib/outreach/admin";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  if (!verifyOutreachPassword(password)) {
    return NextResponse.redirect(new URL("/admin/outreach?error=invalid-password", request.url), { status: 303 });
  }

  const session = createOutreachSession();
  const response = NextResponse.redirect(new URL("/admin/outreach", request.url), { status: 303 });
  response.cookies.set(session.name, session.value, session.options);
  return response;
}
