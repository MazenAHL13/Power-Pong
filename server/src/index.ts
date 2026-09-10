import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    service: "power-pong-arena",
    message: "Servidor Express activo"
  });
});

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const clientDist = path.resolve(currentDir, "../../client/dist");

app.use(express.static(clientDist));

app.get(/.*/, (_request, response) => {
  response.sendFile(path.join(clientDist, "index.html"));
});

app.listen(port, () => {
  console.log(`Power Pong Arena server running on port ${port}`);
});
