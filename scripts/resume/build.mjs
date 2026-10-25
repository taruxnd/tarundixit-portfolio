// Prints scripts/resume/resume.html to public/tarun-dixit-resume.pdf with headless Chrome.
// Usage: node scripts/resume/build.mjs [input.html] [output.pdf]   (defaults to the site resume)
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const [inputArg, outputArg] = process.argv.slice(2);
const source = pathToFileURL(inputArg ? path.resolve(inputArg) : path.join(here, "resume.html")).href;
const out = outputArg ? path.resolve(outputArg) : path.join(here, "..", "..", "public", "tarun-dixit-resume.pdf");
const chromePath = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const profile = mkdtempSync(path.join(tmpdir(), "resume-chrome-"));
const port = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(chromePath, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  let targets;
  for (let i = 0; i < 40 && !targets; i++) {
    try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); } catch { await sleep(250); }
  }
  const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); pending.get(m.id)?.(m); pending.delete(m.id); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

  await send("Page.enable");
  await send("Page.navigate", { url: source });
  await sleep(1500);
  // Wait for the web fonts so the PDF embeds them instead of the fallbacks.
  await send("Runtime.evaluate", { expression: "document.fonts.ready.then(() => true)", awaitPromise: true });
  const pdf = await send("Page.printToPDF", { preferCSSPageSize: true, printBackground: true, generateDocumentOutline: false });
  writeFileSync(out, Buffer.from(pdf.result.data, "base64"));
  console.log(`Wrote ${path.relative(process.cwd(), out)}`);
  ws.close();
} finally {
  const exited = new Promise((r) => chrome.once("exit", r));
  chrome.kill();
  await exited;
  rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
