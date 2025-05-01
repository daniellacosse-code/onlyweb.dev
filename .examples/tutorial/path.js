import { dirname, fromFileUrl, join, resolve } from "jsr:@std/path";

export const convertToAbsolutePath = (projectRootPath) => {
  return join(
    resolve(dirname(fromFileUrl(import.meta.url))),
    projectRootPath,
  );
};
