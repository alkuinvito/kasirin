import { NextApiRequest, NextApiResponse, PageConfig } from "next";
import formidable from "formidable";
import { mkdirSync, existsSync, unlinkSync } from "fs";
import { FormidableError } from "@/lib/schema";
const cloudinary = require("cloudinary").v2;

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  secure: true,
});

const parseForm = async (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const dir = `${__dirname}/../../../../uploads`;
    if (!existsSync(dir)) {
      try {
        mkdirSync(dir, { recursive: false });
      } catch (e) {
        return reject(e);
      }
    }

    const form = formidable({
      uploadDir: dir,
      keepExtensions: true,
      maxFiles: 1,
      maxFileSize: 2 * 1024 * 1024,
      filter: ({ mimetype }) => {
        if (mimetype && mimetype.includes("image")) {
          return true;
        }
        reject("Invalid image type");
        return false;
      },
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(err);
      }

      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      };

      const file = files.image as formidable.File[];
      const result = await cloudinary.uploader.upload(
        file[0].filepath,
        options
      );
      unlinkSync(file[0].filepath);
      return resolve(result.secure_url);
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      try {
        const filename = await parseForm(req);
        return res.status(200).json({
          image: filename,
        });
      } catch (e) {
        const err = FormidableError.safeParse(e);
        if (err.success) {
          if (err.data.code === 1009) {
            return res
              .status(400)
              .json({ error: "Image size must less than 2 mb" });
          }
          return res
            .status(err.data.httpCode || 500)
            .json({ error: err.data.message });
        } else if (e === "Invalid image type") {
          return res.status(400).json({ error: e });
        }
        return res.status(500).json({ error: e });
      }
    default:
      return res.status(405).json({ error: "Invalid method" });
  }
}
