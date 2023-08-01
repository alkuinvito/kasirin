import sharp from "sharp";

export function toSnakeCase(str: string): string {
  if (str) {
    return str
      .toLowerCase()
      .split(" ")
      .join("-")
      .replace(/[^a-z0-9\-]/gi, "");
  }
  return "";
}

export async function CompressImg(image: string, size = 240): Promise<string> {
  const parts = image.split(";");
  const imageData = parts[1].split(",")[1];

  const img = Buffer.from(imageData, "base64");
  try {
    const result = await sharp(img)
      .resize({ width: size, fit: "cover" })
      .toFormat("webp")
      .toBuffer();
    const resizedImg = result.toString("base64");
    return `data:image/webp;base64,${resizedImg}`;
  } catch (e) {
    console.error(e);
    return "";
  }
}
