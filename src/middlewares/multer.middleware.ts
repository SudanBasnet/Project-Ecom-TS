import multer from "multer";
import path from "path";
import fs from "fs";
import appError from "../utils/appError.utils";

export const multerUploader = () => {
  //!upload folder
  const uploadFolder = path.join(process.cwd(), "uploads");
  const fileSize = 10 * 1024 * 1024;
  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
  }

  //!multer storage

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
      const uniqueName =
        Date.now() + "-" + file.originalname.replace(/\s/g, "");
      cb(null, uniqueName);
    },
  });
  //!file filter

  const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
    const allowedExtentios = /png|jpg|jpeg|webp/;
    const allowedMimeType = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/webp",
      "application/pdf",
    ];
    const extName = allowedExtentios.test(
      path.extname(file.originalname).toLocaleLowerCase(),
    );
    const isAllowedMimeType = allowedMimeType.includes(file.mimetype);
    if (extName && isAllowedMimeType) {
      cb(null, true);
    } else {
      const error = new appError(
        `only image (png ,jpg ,jpeg and webp) and pdf are allowed`,
        400,
      );
      cb(error);
    }
  };

  //!multer upload api
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: fileSize,
    },
  });
  return upload;
};
