import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth(req => {
	const { pathname } = req.nextUrl;
	if (pathname.startsWith("/donate") || pathname.startsWith('/stats')) {
    if (!req.auth) return NextResponse.redirect(new URL("/", req.url));
	}
});

export const config = {
	matcher: ["/donate/:path*", "/stats/:path*"],
};
