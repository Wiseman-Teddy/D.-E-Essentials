import express from "express";
import path from "path";
import { fileURLToPath } from "url";
// Vite is imported dynamically in dev mode
import compression from "compression";
import helmet from "helmet";
import apiApp from "./api/index.js"; // Import the Vercel-ready API

// Create a new express app for the main server wrapper
const app = express();

// Apply production performance and security middlewares
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: false, // Disabled to prevent blocking Vite's inline scripts/styles
  crossOriginEmbedderPolicy: false,
}));

// Mount the API routes
app.use(apiApp);

// Only start the full server locally if not on Vercel
if (!process.env.VERCEL) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const PORT = Number(process.env.PORT) || 3000;

  async function startServer() {
    const isCompiled = __filename.endsWith('server.js') && __dirname.includes('dist');
    const isProd = process.env.NODE_ENV === "production" || isCompiled;

    if (!isProd) {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      // If we're already in dist (isCompiled), static path is __dirname
      // Otherwise it's process.cwd() + '/dist'
      const distPath = isCompiled ? __dirname : path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[Server] D & E Essentials running on http://localhost:${PORT}`);
    });
  }

  startServer();
}

export default app;
