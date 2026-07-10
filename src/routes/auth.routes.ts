import express from "express";
import {
  changeProfilePicture,
  getProfile,
  login,
  logout,
  register,
} from "../controllers/auth.controller";
import { multerUploader } from "../middlewares/multer.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { All_Users } from "../types/enum.types";

const router = express.Router();

const upload = multerUploader();

//! create account
router.post("/register", upload.single("profile_image"), register);

//! login user
router.post("/login", login);

//! change profile image
router.put(
  "/change-profile-image",
  upload.single("profile_image"),
  authenticate(All_Users),
  changeProfilePicture,
);

router.get("/me", authenticate(All_Users), getProfile);
router.get("/logout", authenticate(All_Users), logout);

export default router;
