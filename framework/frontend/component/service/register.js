export async function RegisterService({
  tag = "custom-service",
  source,
  scope = "/",
  handleMount = () => {}
}) {
  if (!("serviceWorker" in navigator))
    return console.warn("Service workers not supported.");

  globalThis.customServices ??= new Map();

  if (globalThis.customServices.get(tag))
    return console.warn(`Service ${tag} already defined.`);

  const workerRegistration = await navigator.serviceWorker.register(source, {
    scope
  });

  let worker;
  if (workerRegistration.active) {
    worker = workerRegistration.active;

    handleMount(worker);
  } else {
    workerRegistration.addEventListener("statechange", (event) => {
      if (event.target.state === "activated") {
        worker = event.target.active;

        handleMount(worker);
      }
    });
  }

  globalThis.customServices.set(tag, worker);

  return globalThis.customServices.get(tag);
}
