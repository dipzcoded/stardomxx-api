import express, { Router } from "express";
import { UploadController } from "../../../controllers/v1";
import {
  uploadImageStorage,
  uploadVideoStorage,
} from "../../../middlewares/v1/upload";

const router: Router = express.Router();
const upload = new UploadController();

router.route("/images").post(uploadImageStorage.any(), upload.uploadImages);
router.route("/video").post(uploadVideoStorage.any(), upload.uploadVideos);

export default router;
