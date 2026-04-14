/**
 * Next.js 16+: o ficheiro era `middleware.ts` e foi renomeado para `proxy.ts`.
 * Clerk continua a expor `clerkMiddleware` (nome histórico); a função corre no boundary de proxy.
 */
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return;
  }
  // Proxies em next.config.ts: /api/* → FastAPI; autorização via JWT no backend.
  if (req.nextUrl.pathname.startsWith("/api")) {
    return;
  }
  await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
