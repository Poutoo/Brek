import createMiddleware from "next-intl/middleware";
import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Routes admin → ADMIN only
        if (pathname.includes("/admin")) {
          return token?.role === "ADMIN";
        }

        // Routes authentifiées
        const authRoutes = ["/compte", "/commandes", "/favoris", "/checkout"];
        if (authRoutes.some((route) => pathname.includes(route))) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const protectedRoutes = ["/admin", "/compte", "/commandes", "/favoris", "/checkout"];
  const isProtected = protectedRoutes.some((route) => pathname.includes(route));

  if (isProtected) {
    return (authMiddleware as (req: NextRequest) => Response)(req);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)" ],
};
