export default async function handler(req, res) {
  const key = req.query.key || req.url?.replace(/^\/api\/storage\/?\??/, "").replace(/^key=/, "");

  if (!key) {
    return res.status(400).send("Missing storage key");
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

    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.redirect(307, url);
  } catch {
    return res.status(502).send("Storage proxy error");
  }
}
