import { resolve } from "https://deno.land/std@0.205.0/path/mod.ts";
import { encodeBase64 } from "https://deno.land/std@0.205.0/encoding/base64.ts";

export enum DataType {
  JPG = "image/jpg",
  PNG = "image/png",
  GIF = "image/gif",
}

// TODO: prob not great SoC - load file and encode in one function
export default async (filePath: string, fileType: DataType = DataType.JPG) => {
  const image = await Deno.readFile(resolve(filePath));

  return `data:${fileType};base64,${encodeBase64(image)}`;
}
