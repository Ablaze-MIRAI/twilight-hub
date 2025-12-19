import { type NextRequest, NextResponse } from "next/server";

import { auth0 } from "./lib/auth0";

export async function proxy(request: NextRequest) {
    const authRes = await auth0.middleware(request);
    if (request.nextUrl.pathname.startsWith("/auth")) {
        return authRes;
    }

    const session = await auth0.getSession();
    if (!session && !request.nextUrl.pathname.startsWith("/signin")) {
        return NextResponse.redirect(new URL("/signin", request.nextUrl.origin));
    } else if (session && request.nextUrl.pathname.startsWith("/signin")) {
        return NextResponse.redirect(new URL("/", request.nextUrl.origin));
    }

    return authRes;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
