import { createRemoteJWKSet, jwtVerify } from 'jose';

export const onRequestGet = async ({ request, env }) => {
  const cookie = request.headers.get('Cookie') || '';
  const m = cookie.match(/(?:^|;\s*)CF_Authorization=([^;]+)/);
  if (!m) return new Response('unauthorized', { status: 401 });

  const token = m[1];
  const issuer = (env.CF_ACCESS_TEAM_DOMAIN || '').replace(/\/$/, '');
  const aud = env.CF_ACCESS_AUD;
  if (!issuer || !aud) return new Response('misconfigured', { status: 500 });

  try {
    const JWKS = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
    const { payload } = await jwtVerify(token, JWKS, { issuer, audience: aud });
    return new Response(JSON.stringify({ email: payload.email }), {
      headers: { 'content-type': 'application/json' },
    });
  } catch {
    return new Response('unauthorized', { status: 401 });
  }
};
