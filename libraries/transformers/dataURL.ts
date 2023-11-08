import { resolve } from "https://deno.land/std@0.205.0/path/mod.ts";
import { encodeBase64 } from "https://deno.land/std@0.205.0/encoding/base64.ts";

export enum FileType {
  JPG = "image/jpg",
  PNG = "image/png",
  GIF = "image/gif",
}

export default async (filePath: string, fileType: FileType = FileType.JPG) => {
  const image = await Deno.readFile(resolve(filePath));

  return `data:${fileType};base64,${encodeBase64(image)}`;
}
