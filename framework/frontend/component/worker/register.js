export async function RegisterWorker({
  tag = "custom-worker",
  source,
  scope = "/",
  handleMount = () => {}
}) {
  // 1. determine worker type
  // => if source is provided, it's a service worker
  // => if it isn't, it's a web worker (for now, skip 2 and 3 and go to 4)
  // 2. if service worker, re-request worker registration with updated tags
  // => `navigator.serviceWorker.register("/app/proxies/worker.js?tags=custom-worker")`
  // 3. backend compiles worker.js based on provided tags,
  // => pulling in the default export of each worker component
  // 4. once registered, call handleMount and communicate via postMessage prepended with tag
}
