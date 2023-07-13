import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "storage/uploads");
  },
  filename(req, file, callback) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(
      null,
      `${file.originalname.split(".")[0]}-${uniqueSuffix}.${
        file.originalname.split(".")[file.originalname.split(".").length - 1]
      }`
    );
  },
});

export const uploadStorage = multer({
  storage,
  limits: {
    files: 1,
    fileSize: 50000,
  },
  fileFilter(req, file, callback) {
    const allowedExtensions = [".jpg", ".jpeg", ".png"];

    const fileExt = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(fileExt)) {
      callback(null, true);
    } else {
      callback(
        new Error("Invalid file type. Only jpg,jpeg and png files are allowed.")
      );
    }
  },
});
