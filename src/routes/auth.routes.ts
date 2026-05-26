import express from "express";
import {
  changeProfilePicture,
  login,
  register,
} from "../controllers/auth.controller";
import { multerUploader } from "../middlewares/multer.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { Role } from "../types/enum.types";
import { All_Users } from "../types/enum.types";

const router = express.Router();

const upload = multerUploader();

//! create account
router.post("/register", upload.single("profile_image"), register);

//! login user
router.post("/login", login);

//! chnage profile image
router.put(
  "/change-profile-image/:id",
  upload.single("profile_image"),
  authenticate(All_Users),
  changeProfilePicture,
);

export default router;
