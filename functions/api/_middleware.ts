export const onRequest = async ({ request, next }: any) => {
  const email = request.headers.get("Cf-Access-Authenticated-User-Email");
  if (!email) return new Response("Unauthorized", { status: 401 });
  return next();
};
