import cloudflareAccess from "@cloudflare/pages-plugin-cloudflare-access";

export const onRequest = [
  cloudflareAccess({
    domain: "https://qially.cloudflareaccess.com",
    aud: "9aacefd80acb55b0f9d5438ef9820abfb29e7577fdb1af912a29efcb3df2cc70",
  }),
  async (ctx: any) => {
    const user = ctx.data.cloudflareAccess?.user;
    if (!user?.email) return new Response("Unauthorized", { status: 401 });
    return ctx.next();
  },
];
