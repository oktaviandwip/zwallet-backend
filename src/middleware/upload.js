const multer = require("multer");
const response = require("../utils/response");
const path = require("path");

const middleware = {
  uploadUser: (req, res, next) => {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "./public/upload");
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
          null,
          (
            file.fieldname +
            "-" +
            uniqueSuffix +
            "-" +
            file.originalname
          ).replace(/[\s()]/g, "-")
        );
      },
    });

    const imageFilter = (req, file, cb) => {
      const allowedExtensions = [".jpeg", ".jpg", ".png", ".svg", ".avif"];
      const extName = path.extname(file.originalname).toLowerCase();
      const exactExt = allowedExtensions.includes(extName);
      if (exactExt) {
        return cb(null, true);
      }
      return cb(
        {
          message:
            "Invalid file extension. Only PNG, JPG, JPEG, and SVG files are allowed!",
        },
        false
      );
    };

    const upload = multer({
      storage: storage,
      fileFilter: imageFilter,
      limits: {
        fileSize: 1 * 1024 * 1024, // File size limit (e.g. 1 MB)
        fieldSize: 1 * 1024 * 1024, // Form field size limit (e.g. 1 MB)
      },
    }).single("photo_profile");

    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return response(res, 500, err.message); // A Multer error occurred when uploading.
      } else if (err) {
        return response(res, 500, err.message); // An unknown error occurred when uploading.
      }
      next(); // Everything went fine.
    });
  },
};

module.exports = middleware;
