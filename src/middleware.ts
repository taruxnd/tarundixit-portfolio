import { NextResponse } from "next/server";

/** Dev-only: stop Safari from serving stale localhost CSS/HTML. */
export function middleware() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0",
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("X-Dev-No-Cache", "1");
  return response;
}

export const config = {
  matcher: ["/((?!_next/image|favicon.ico).*)"],
};
