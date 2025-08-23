export const onRequest = async (ctx) => {
    const url = new URL(ctx.request.url);
  
    // Let API routes be handled by other functions/middleware
    if (url.pathname.startsWith("/api")) return ctx.next();
  
    // Ask the default asset handler for this path first
    const res = await ctx.next();
    if (res.status !== 404) return res;
  
    // Fallback to root (index.html) so the SPA router can take over
    return ctx.env.ASSETS.fetch(new Request(new URL("/", ctx.request.url), ctx.request));
  };
  