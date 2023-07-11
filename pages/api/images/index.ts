import { NextApiRequest, NextApiResponse, PageConfig } from "next";
import formidable from "formidable";
import { mkdirSync, existsSync } from "fs";
import { FormidableError } from "@/lib/schema";

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

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

    form.parse(req, function (err, fields, files) {
      if (err) {
        return reject(err);
      }
      return resolve({ fields, files });
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
        const { files } = await parseForm(req);
        const file = files.image as formidable.File[];
        return res
          .status(200)
          .json({
            image: `${process.env.NEXT_PUBLIC_APP_HOST}/uploads/${file[0].newFilename}`,
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
