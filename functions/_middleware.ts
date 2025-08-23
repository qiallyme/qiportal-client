import type { PagesFunction } from '@cloudflare/workers-types';

export const onRequest = async ({ request, next }: any) => {
    const email = request.headers.get("Cf-Access-Authenticated-User-Email");
    const jwt = request.headers.get("Cf-Access-Jwt-Assertion");
    if (!email || !jwt) return new Response("Unauthorized", { status: 401 });
    return await next();
  };
  