export const onRequest = async ({ request, next }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': 'https://qially.com',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, CF-Access-Client-Id, CF-Access-Client-Secret, Authorization',
      },
    });
  }

  const res = await next();
  const h = new Headers(res.headers);
  h.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  h.set('X-Content-Type-Options', 'nosniff');
  h.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // If your public site calls portal APIs:
  const origin = request.headers.get('Origin');
  if (origin === 'https://qially.com') {
    h.set('Access-Control-Allow-Origin', origin);
    h.set('Access-Control-Allow-Credentials', 'true');
  }

  return new Response(res.body, { ...res, headers: h });
};
