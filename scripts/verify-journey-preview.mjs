// Self-contained local production check; the server is always stopped on exit.
// Run after npm run build. No deployment or external writes.
import { spawn } from "node:child_process";
import { once } from "node:events";
import { setTimeout } from "node:timers/promises";

const base = "http://127.0.0.1:3157";
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3157"], { stdio: ["ignore", "pipe", "pipe"] });
let startup = "";
server.stdout.on("data", (chunk) => { startup += chunk; });
server.stderr.on("data", (chunk) => { startup += chunk; });
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw new Error(`Preview exited: ${startup}`);
    try { if ((await fetch(`${base}/history/journeys`)).ok) { ready = true; break; } } catch {}
    await setTimeout(100);
  }
  if (!ready) throw new Error(`Preview failed to start: ${startup}`);
  const check = spawn(process.execPath, ["scripts/verify-journey-pages.mjs"], { stdio: "inherit", env: { ...process.env, BASE_URL: base } });
  const [code] = await once(check, "exit");
  if (code !== 0) throw new Error(`Journey verification exited ${code}`);
} finally {
  if (server.exitCode === null) {
    const stopped = once(server, "exit");
    server.kill("SIGTERM");
    await stopped;
  }
}
