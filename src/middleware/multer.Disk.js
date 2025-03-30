import multer from "multer";
import { nanoid } from "nanoid";
import fs from "fs";
export const fileTypes = {
  image: ["image/png", "image/jpeg", "image/gif"],
  video: ["video/mp4"],
  audio: ["audio/mpeg"],
  pdf:[""]
};

// store multer local
export const multerDisk = function (
  customValidation = [],
  customPath = "generals"
) {
  const fullPath = `uploads/${customPath}`;
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, fullPath);
    },
    filename: function (req, file, cb) {
      cb(null, nanoid(4) + file.originalname);
    },
  });

  function fileFilter(req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("invalid file type", false));
    }
  }
  const upload = multer({ storage, fileFilter });
  return upload;
};
export const multerHost = function (customValidation = []) {
  const storage = multer.diskStorage({});

  function fileFilter(req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("invalid file type", false));
    }
  }
  const upload = multer({ storage, fileFilter });
  return upload;
};
