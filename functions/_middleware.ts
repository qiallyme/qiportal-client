// functions/_middleware.ts
export const onRequest: PagesFunction = async ({ request, next }) => {
  const email = request.headers.get('Cf-Access-Authenticated-User-Email');
  const jwt = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!email || !jwt) return new Response('Unauthorized', { status: 401 });
  return next();
};
