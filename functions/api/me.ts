export const onRequestGet = async ({ request }: any) => {
    // Access injects these when the request is allowed
    const email = request.headers.get("Cf-Access-Authenticated-User-Email");
    const jwt = request.headers.get("Cf-Access-Jwt-Assertion");
  
    if (!email || !jwt) {
      return new Response("Unauthorized", { status: 401 });
    }
  
    return Response.json({ email });
  };
  