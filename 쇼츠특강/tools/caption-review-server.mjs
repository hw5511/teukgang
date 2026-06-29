import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultStoryboardPath = path.join(process.cwd(), "storyboards", "image-dancing-plague.storyboard.json");
const htmlPath = path.join(__dirname, "caption-review.html");

const getArg = (name, fallback) => {
  const index = process.argv.indexOf(name);
  if (index >= 0 && process.argv[index + 1] && !process.argv[index + 1].startsWith("--")) {
    return process.argv[index + 1];
  }
  return fallback;
};

const storyboardPath = path.resolve(getArg("--storyboard", defaultStoryboardPath));
const port = Number(getArg("--port", "8787"));

const readStoryboard = async () => {
  const raw = await fs.readFile(storyboardPath, "utf8");
  return JSON.parse(raw);
};

const writeStoryboard = async (storyboard) => {
  const serialized = `${JSON.stringify(storyboard, null, 2)}\n`;
  await fs.writeFile(storyboardPath, serialized, "utf8");
};

const readBody = async (request) => {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : null;
};

const send = (response, statusCode, body, headers = {}) => {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    ...headers,
  });
  response.end(body);
};

const sendJson = (response, statusCode, body) => {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(body, null, 2));
};

const html = await fs.readFile(htmlPath, "utf8");

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);

  try {
    if (request.method === "GET" && url.pathname === "/") {
      response.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
      });
      response.end(html);
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/storyboard") {
      const storyboard = await readStoryboard();
      sendJson(response, 200, {
        storyboardPath,
        storyboard,
      });
      return;
    }

    if (request.method === "PUT" && url.pathname === "/api/storyboard") {
      const payload = await readBody(request);
      if (!payload || typeof payload !== "object" || !payload.storyboard) {
        sendJson(response, 400, {
          ok: false,
          error: "Request body must include a storyboard object.",
        });
        return;
      }

      await writeStoryboard(payload.storyboard);
      sendJson(response, 200, {
        ok: true,
        storyboardPath,
      });
      return;
    }

    if (request.method === "GET" && url.pathname === "/healthz") {
      send(response, 200, "ok");
      return;
    }

    send(response, 404, "Not found");
  } catch (error) {
    sendJson(response, 500, {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Caption review server listening on http://127.0.0.1:${port}`);
  console.log(`Storyboard: ${storyboardPath}`);
});

