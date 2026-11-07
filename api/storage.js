/**
 * Vercel function: /storage/:key → presigned URL from the storage backend.
 * Guard rails:
 *  - Only flat, image-like filenames are allowed (no traversal, no dotfiles,
 *    no documents that shouldn't be shared).
 *  - Responses are cached briefly (signed URLs expire; long-lived caching of
 *    redirects would break images later).
 */
const MAX_AGE_SECONDS = 300;

// Flat filename only: letters, digits, dash, underscore, dot; must have a
// safe image/video extension; no "..", no leading dot.
const KEY_PATTERN = /^(?!\.)[A-Za-z0-9][A-Za-z0-9._-]+\.(?:jpe?g|png|webp|avif|gif|mp4)$/i;

export default async function handler(req, res) {
  const key = req.query.key || req.url?.replace(/^\/api\/storage\/?\??/, "").replace(/^key=/, "");

  if (!key || !KEY_PATTERN.test(String(key).replace(/%20/g, " ")) || String(key).includes("/")) {
    return res.status(400).send("Invalid storage key");
  }

  const forgeBaseUrl = (process.env.BUILT_IN_FORGE_API_URL || "").replace(/\/+$/, "");
  const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;

  if (!forgeBaseUrl || !forgeKey) {
    return res.status(500).send("Storage proxy not configured");
  }

  try {
    const forgeUrl = new URL("v1/storage/presign/get", forgeBaseUrl + "/");
    forgeUrl.searchParams.set("path", key);

    const forgeResp = await fetch(forgeUrl, {
      headers: { Authorization: `Bearer ${forgeKey}` },
    });

    if (!forgeResp.ok) {
      return res.status(502).send("Storage backend error");
    }

    const { url } = await forgeResp.json();
    if (!url) {
      return res.status(502).send("Empty signed URL");
    }

    res.setHeader(
      "Cache-Control",
      `public, max-age=${MAX_AGE_SECONDS}, stale-while-revalidate=${MAX_AGE_SECONDS * 2}`,
    );
    return res.redirect(307, url);
  } catch {
    return res.status(502).send("Storage proxy error");
  }
}
