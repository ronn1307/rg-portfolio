// GET /api/claps?slug=my-blog-post  → returns { claps: 42 }
// POST /api/claps { slug: "my-blog-post" } → increments and returns { claps: 43 }

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

// GET — fetch current clap count for a slug
export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const slug = url.searchParams.get("slug");

  if (!slug) {
    return Response.json({ error: "Missing slug parameter" }, {
      status: 400,
      headers: CORS_HEADERS,
    });
  }

  const claps = parseInt(await context.env.BLOG_CLAPS.get(slug)) || 0;

  return Response.json({ claps }, { headers: CORS_HEADERS });
}

// POST — add claps for a slug
export async function onRequestPost(context) {
  try {
    const { slug, count = 1 } = await context.request.json();

    if (!slug) {
      return Response.json({ error: "Missing slug" }, {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    // Cap increment at 50 per request to prevent abuse
    const increment = Math.min(Math.max(1, Math.floor(count)), 50);
    const current = parseInt(await context.env.BLOG_CLAPS.get(slug)) || 0;
    const updated = current + increment;

    await context.env.BLOG_CLAPS.put(slug, updated.toString());

    return Response.json({ claps: updated }, { headers: CORS_HEADERS });
  } catch (err) {
    return Response.json({ error: "Invalid request body" }, {
      status: 400,
      headers: CORS_HEADERS,
    });
  }
}
