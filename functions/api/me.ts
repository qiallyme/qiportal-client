export const onRequestGet = async (ctx: any) => {
  const user = ctx.data.cloudflareAccess?.user;
  return Response.json({
    email: user.email,
    sub: user.sub,
    aud: user.aud,
  });
};
