// Capture the assets actually loaded by this tab, not a manifest fetched later.
export function createDeploymentChecker(
  browser = window,
  page = document,
  publicUrl = process.env.PUBLIC_URL || ""
) {
  const loadedAssets = new Set(
    Array.from(page.querySelectorAll('script[src], link[rel="stylesheet"]'))
      .map((asset) => asset.src || asset.href)
  );
  const manifestUrl = new URL(`${publicUrl}/asset-manifest.json`, browser.location.origin);
  let checking = false;
  let reloading = false;

  return async function checkDeployment() {
    if (checking || reloading) return;
    checking = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      manifestUrl.searchParams.set("_check", Date.now().toString());
      const response = await browser.fetch(manifestUrl.href, {
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) return;
      const manifest = await response.json();
      if (!Array.isArray(manifest.entrypoints)) return;

      const assets = manifest.entrypoints.filter(
        (asset) => typeof asset === "string" && /\.(js|css)$/.test(asset)
      );
      if (!assets.some((asset) => /\.js$/.test(asset))) return;
      const assetBase = new URL(`${publicUrl}/`, browser.location.origin);
      if (assets.every((asset) => loadedAssets.has(new URL(asset, assetBase).href))) return;

      // A versioned navigation bypasses the cached HTML while keeping the destination.
      const version = assets.join("|").split("").reduce(
        (hash, character) => ((hash * 31) + character.charCodeAt(0)) | 0,
        0
      ).toString(16);
      const destination = new URL(browser.location.href);
      // Avoid a reload loop if a proxy still serves stale HTML during deployment.
      if (destination.searchParams.get("_appVersion") === version) return;
      destination.searchParams.set("_appVersion", version);
      reloading = true;
      browser.location.replace(destination.href);
    } catch (error) {
      // Offline, incomplete deployments and invalid responses must not stop navigation.
    } finally {
      clearTimeout(timeout);
      checking = false;
    }
  };
}
