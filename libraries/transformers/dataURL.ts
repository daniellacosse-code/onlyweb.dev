import { encodeBase64 } from "https://deno.land/std@0.205.0/encoding/base64.ts";

export default async (filePath: string, fileType = "image/jpg") => {
  const image = await Deno.readFile(filePath);

  return `data:${fileType};base64,${encodeBase64(image)}`;
}
