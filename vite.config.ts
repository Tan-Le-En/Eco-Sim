import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";

/**
 * Dev-only storage middleware. When Forge credentials exist, /storage/:key
 * redirects to a presigned URL; otherwise (no env configured) it falls
 * through to Vite's static handler so client/public/storage files just work.
 */
function vitePluginStorageProxy(): Plugin {
  return {
    name: "storage-proxy",
    configureServer(server: ViteDevServer) {
      server.middlewares.use("/storage", async (req, res, next) => {
        const key = req.url?.replace(/^\//, "").replace(/\?.*$/, "");
        if (!key) {
          return res.writeHead(400, { "Content-Type": "text/plain" }).end("Missing storage key");
        }

        const forgeBaseUrl = (process.env.BUILT_IN_FORGE_API_URL || "").replace(/\/+$/, "");
        const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;

        // Not configured: serve the committed file from public/ instead.
        if (!forgeBaseUrl || !forgeKey) {
          return next();
        }

        try {
          const forgeUrl = new URL("v1/storage/presign/get", forgeBaseUrl + "/");
          forgeUrl.searchParams.set("path", key);

          const forgeResp = await fetch(forgeUrl, {
            headers: { Authorization: `Bearer ${forgeKey}` },
          });

          if (!forgeResp.ok) {
            res.writeHead(502, { "Content-Type": "text/plain" });
            res.end("Storage backend error");
            return;
          }

          const { url } = (await forgeResp.json()) as { url: string };
          if (!url) {
            res.writeHead(502, { "Content-Type": "text/plain" });
            res.end("Empty signed URL");
            return;
          }

          res.writeHead(307, { Location: url, "Cache-Control": "no-store" });
          res.end();
        } catch {
          res.writeHead(502, { "Content-Type": "text/plain" });
          res.end("Storage proxy error");
        }
      });
    },
  };
}

export default defineConfig(({ command }) => {
  const isDev = command === "serve";
  const plugins = [
    react(),
    tailwindcss(),
    ...(isDev ? [vitePluginStorageProxy()] : []),
  ];

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
      },
    },
    envDir: path.resolve(import.meta.dirname),
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "wouter"],
            charts: ["recharts"],
            motion: ["framer-motion"],
          },
        },
      },
    },
    server: {
      port: 3000,
      strictPort: false, // Will find next available port if 3000 is busy
      host: true,
      allowedHosts: [
        "localhost",
        "127.0.0.1",
      ],
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
