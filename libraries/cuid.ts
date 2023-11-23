let counter = 0;

export function cuid({
  timestampLength = (2 ** 2),
  counterLength = (2 ** 2),
  namespace = ""
} = {}) {
  const timestamp = btoa(String(Date.now()))
    .replaceAll("=", "")
    .slice(-1 * timestampLength);

  counter++;

  const counterString = String(counter).padStart(counterLength, "0");

  const cuidParts = namespace
    ? [namespace.replaceAll("-", "_"), timestamp, counterString]
    : [timestamp, counterString];

  return cuidParts.join("_");
}
