import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { config } from "@/config/config";
import NotFound from "@/app/not-found";

const secret = process.env.SECRET;

const middleware = async (request) => {
  const { pathname } = request.nextUrl;
  const getStaticPaths = (array) => {
    const paths = [];
    array.forEach((path) => {
      paths.push(`/${path.iso}`);
    });
    return paths;
  };

  const additionalPaths = [
    "/settings",
    "/rea",
    "/tutumi",
    "/toolight",
    "/user",
  ];

  const protectedPaths = [
    ...new Set(getStaticPaths(config.data)),
    ...additionalPaths,
  ];

  const matchesProtectedPaths = protectedPaths.some((path) => {
    return pathname.startsWith(path);
  });

  const token = await getToken({ req: request, secret });
  if (pathname === "/") {
    if (!token) {
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  if (pathname === "/login") {
    if (!token) {
      return NextResponse.next();
    }
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }
  if (matchesProtectedPaths) {
    if (pathname === "/settings") {
      if (!token) {
        const url = new URL("/login", request.url);
        return NextResponse.redirect(url);
      }
      if (token.user.role === "admin") {
        return NextResponse.next();
      }
      const url = new URL("/", request.url);
      return NextResponse.redirect(url);
    }
    if (!token) {
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
};

export { middleware };
