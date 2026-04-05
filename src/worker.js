// Worker entry point — handles /api/claps requests, everything else served as static assets

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (url.pathname === "/api/claps" && request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // GET /api/claps?slug=...
    if (url.pathname === "/api/claps" && request.method === "GET") {
      const slug = url.searchParams.get("slug");
      if (!slug) {
        return Response.json({ error: "Missing slug parameter" }, {
          status: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      }
      const claps = parseInt(await env.BLOG_CLAPS.get(slug)) || 0;
      return Response.json({ claps }, {
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    // POST /api/claps { slug, count }
    if (url.pathname === "/api/claps" && request.method === "POST") {
      try {
        const { slug, count = 1 } = await request.json();
        if (!slug) {
          return Response.json({ error: "Missing slug" }, {
            status: 400,
            headers: { "Access-Control-Allow-Origin": "*" },
          });
        }
        const increment = Math.min(Math.max(1, Math.floor(count)), 50);
        const current = parseInt(await env.BLOG_CLAPS.get(slug)) || 0;
        const updated = current + increment;
        await env.BLOG_CLAPS.put(slug, updated.toString());
        return Response.json({ claps: updated }, {
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      } catch (err) {
        return Response.json({ error: "Invalid request body" }, {
          status: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    // Everything else — pass through to static assets
    return env.ASSETS.fetch(request);
  },
};
