import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
	const { pathname } = req.nextUrl;

	if (pathname.startsWith("/donate") || pathname.startsWith("/stats")) {
		if (!req.auth) return NextResponse.redirect(new URL("/", req.url));
	}
	if (pathname.startsWith("/admin")) {
		if (!req.auth || (req.auth && !req.auth.isAdmin)) return NextResponse.redirect(new URL("/", req.url));
	}
})

export const config = {
	matcher: [ "/donate/:path*", "/stats/:path*", "/admin/:path*" ],
};
