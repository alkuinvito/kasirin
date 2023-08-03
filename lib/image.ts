import cuid from "cuid";
import { MinioClient } from "./minio";

const sharp = require("sharp");

export async function CompressImg(
  image: string,
  size: number
): Promise<Buffer> {
  const parts = image.split(";");
  const imageData = parts[1].split(",")[1];

  const img = Buffer.from(imageData, "base64");
  try {
    const result = await sharp(img)
      .resize({ width: size, fit: "cover" })
      .toFormat("webp")
      .toBuffer();
    return result;
  } catch (e) {
    throw new Error("Failed to compress image");
  }
}

export async function UploadImg(image: string, size = 320): Promise<string> {
  const filename = cuid();
  const img = await CompressImg(image, size);
  try {
    await MinioClient.putObject(
      process.env.MINIO_BUCKET_NAME,
      `${filename}.webp`,
      img
    );
    return `${process.env.ASSETS_URL}/${filename}.webp`;
  } catch (err) {
    throw new Error("Failed to upload image");
  }
}
