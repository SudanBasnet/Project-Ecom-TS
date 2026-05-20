import express from "express";
import { login, register } from "../controllers/auth.controller";
import multer from "multer";
import path from "path";
import fs from "fs";
const router = express.Router();

//!upload folder
const uploadFolder = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

//!multer storage

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploadFolder");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

//!create account
router.post("/register", upload.single("profile_image"), register);
//!login account
router.post("/login", login);

export default router;
