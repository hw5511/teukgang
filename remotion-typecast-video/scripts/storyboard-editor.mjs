import { spawn } from "node:child_process";
import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(scriptDir, "storyboard-editor.html");
const storyboardPath = path.join(root, "src", "info-short", "storyboard.json");
const outDir = path.join(root, "out");
const port = Number(process.env.STORYBOARD_EDITOR_PORT || 5174);

let renderState = {
  running: false,
  startedAt: null,
  finishedAt: null,
  exitCode: null,
  output: null,
  pid: null,
  log: "",
};

const send = (res, status, body, type = "application/json; charset=utf-8") => {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
  });
  res.end(typeof body === "string" ? body : JSON.stringify(body));
};

const readBody = async (req) => {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
};

const readStoryboard = async () => {
  const raw = await fs.readFile(storyboardPath, "utf8");
  return JSON.parse(raw);
};

const writeStoryboard = async (storyboard) => {
  if (!storyboard || !Array.isArray(storyboard.scenes)) {
    throw new Error("storyboard.scenes must be an array");
  }

  const backupPath = storyboardPath.replace(/\.json$/, ".backup.json");
  const current = await fs.readFile(storyboardPath, "utf8");
  await fs.writeFile(backupPath, current, "utf8");
  await fs.writeFile(storyboardPath, `${JSON.stringify(storyboard, null, 2)}\n`, "utf8");
};

const startRender = (outputName) => {
  if (renderState.running) {
    throw new Error("Render is already running");
  }

  const safeName = (outputName || "storyboard-ui-render.mp4")
    .replace(/[^\w.-]/g, "-")
    .replace(/^-+/, "");
  const finalName = safeName.endsWith(".mp4") ? safeName : `${safeName}.mp4`;
  const output = `out/${finalName}`;
  const command = process.platform === "win32" ? "cmd.exe" : "npm";
  const args =
    process.platform === "win32"
      ? ["/d", "/s", "/c", `npm run render -- InfoShort ${output}`]
      : ["run", "render", "--", "InfoShort", output];

  renderState = {
    running: true,
    startedAt: new Date().toISOString(),
    finishedAt: null,
    exitCode: null,
    output,
    pid: null,
    log: `Starting render: ${output}\n`,
  };

  const child = spawn(command, args, {
    cwd: root,
    shell: false,
  });
  renderState.pid = child.pid ?? null;
  renderState.log += `pid: ${renderState.pid ?? "-"}\n`;

  child.stdout.on("data", (chunk) => {
    renderState.log += chunk.toString();
    renderState.log = renderState.log.slice(-24000);
  });

  child.stderr.on("data", (chunk) => {
    renderState.log += chunk.toString();
    renderState.log = renderState.log.slice(-24000);
  });

  child.on("close", (code) => {
    renderState.running = false;
    renderState.finishedAt = new Date().toISOString();
    renderState.exitCode = code;
  });

  child.on("error", (error) => {
    renderState.running = false;
    renderState.finishedAt = new Date().toISOString();
    renderState.exitCode = 1;
    renderState.log += `\n${error.message}`;
  });

  return renderState;
};

const serveOutFile = async (res, pathname) => {
  const relative = decodeURIComponent(pathname.replace(/^\/out\//, ""));
  const target = path.resolve(outDir, relative);

  if (!target.startsWith(path.resolve(outDir))) {
    send(res, 403, { error: "Forbidden" });
    return;
  }

  try {
    await fs.access(target);
    res.writeHead(200, {
      "Content-Type": target.endsWith(".mp4") ? "video/mp4" : "application/octet-stream",
      "Cache-Control": "no-store",
    });
    createReadStream(target).pipe(res);
  } catch {
    send(res, 404, { error: "File not found" });
  }
};

const server = createServer(async (req, res) => {
  const requestUrl = new URL(req.url || "/", `http://${req.headers.host}`);
  const pathname = requestUrl.pathname;

  try {
    if (req.method === "GET" && pathname === "/") {
      send(res, 200, await fs.readFile(htmlPath, "utf8"), "text/html; charset=utf-8");
      return;
    }

    if (req.method === "GET" && pathname === "/api/storyboard") {
      send(res, 200, await readStoryboard());
      return;
    }

    if (req.method === "POST" && pathname === "/api/storyboard") {
      await writeStoryboard(JSON.parse(await readBody(req)));
      send(res, 200, { ok: true });
      return;
    }

    if (req.method === "POST" && pathname === "/api/render") {
      const body = await readBody(req);
      const payload = body ? JSON.parse(body) : {};
      send(res, 200, startRender(payload.outputName));
      return;
    }

    if (req.method === "GET" && pathname === "/api/render-status") {
      send(res, 200, renderState);
      return;
    }

    if (req.method === "GET" && pathname.startsWith("/out/")) {
      await serveOutFile(res, pathname);
      return;
    }

    send(res, 404, { error: "Not found" });
  } catch (error) {
    send(res, 500, { error: error instanceof Error ? error.message : String(error) });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`storyboard-editor listening at http://127.0.0.1:${port}`);
});
