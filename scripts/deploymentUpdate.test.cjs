const { test, mock } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");

// Load the dependency-free browser module without the legacy CRA/Jest toolchain.
const source = readFileSync(path.join(__dirname, "../src/utils/deploymentUpdate.js"), "utf8");
const checkerModule = import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

async function setup(entrypoints = ["static/js/main.old.js", "static/css/main.old.css"]) {
  const { createDeploymentChecker } = await checkerModule;
  const browser = {
    location: {
      origin: "https://example.com",
      href: "https://example.com/registros?periodo=11#detalle",
      replace: mock.fn(),
    },
    fetch: mock.fn(async () => ({ ok: true, json: async () => ({ entrypoints }) })),
  };
  const page = {
    querySelectorAll: () => [
      { src: "https://example.com/static/js/main.old.js" },
      { href: "https://example.com/static/css/main.old.css" },
    ],
  };
  return { browser, check: createDeploymentChecker(browser, page, ""), page, createDeploymentChecker };
}

test("matching assets do not reload; the manifest bypasses cache", async () => {
  const { browser, check } = await setup();
  await check();
  assert.equal(browser.location.replace.mock.callCount(), 0);
  const [url, options] = browser.fetch.mock.calls[0].arguments;
  assert.match(url, /asset-manifest.json\?_check=/);
  assert.equal(options.cache, "no-store");
});

for (const asset of ["static/js/main.new.js", "static/css/main.new.css"]) {
  test(`changed asset ${asset} reloads the latest destination without a loop`, async () => {
    const { browser, check, page, createDeploymentChecker } = await setup(["static/js/main.old.js", asset]);
    const pending = check();
    browser.location.href = "https://example.com/miembros?buscar=Ana#lista";
    await pending;
    const destination = new URL(browser.location.replace.mock.calls[0].arguments[0]);
    assert.equal(destination.pathname, "/miembros");
    assert.equal(destination.searchParams.get("buscar"), "Ana");
    assert.equal(destination.hash, "#lista");
    assert.ok(destination.searchParams.get("_appVersion"));
    browser.location.href = destination.href;
    await check();
    // Simulate a fresh page that still received stale HTML from a proxy.
    await createDeploymentChecker(browser, page, "")();
    assert.equal(browser.location.replace.mock.callCount(), 1);
  });
}

test("offline navigation does not reload and subsequent navigation retries", async () => {
  const { browser, check } = await setup(["static/js/main.new.js"]);
  browser.fetch.mock.mockImplementationOnce(async () => { throw new Error("offline"); });
  await check();
  assert.equal(browser.location.replace.mock.callCount(), 0);
  await check();
  assert.equal(browser.location.replace.mock.callCount(), 1);
});

for (const response of [{ ok: false }, { ok: true, json: async () => ({}) }]) {
  test("failed or incomplete deployment responses do not reload", async () => {
    const { browser, check } = await setup();
    browser.fetch.mock.mockImplementation(async () => response);
    await check();
    assert.equal(browser.location.replace.mock.callCount(), 0);
  });
}

test("rapid navigation coalesces pending checks", async () => {
  const { browser, check } = await setup();
  await Promise.all([check(), check(), check()]);
  assert.equal(browser.fetch.mock.callCount(), 1);
});
