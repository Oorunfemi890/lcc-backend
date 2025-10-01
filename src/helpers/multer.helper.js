const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../logger/winston');
const fileTypeConstant = require('../constant/file-type.constant');

const uploadFileLocalStorage = (req) => {
  try {
    return new Promise((resolve, reject) => {
     
      // Create the directory if it doesn't exist
      if (!fs.existsSync(fileTypeConstant.UPLOAD_DIR)) {
        fs.mkdirSync(fileTypeConstant.UPLOAD_DIR, { recursive: true });
      }

      // Multer storage configuration
      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, fileTypeConstant.UPLOAD_DIR);
        },
        filename: function (req, file, cb) {
          // Use the original filename with its extension
          cb(null, file.originalname);
        },
      });

      // Multer instance
      const upload = multer({ storage: storage, limits: { fileSize: 10000000 } }).single('file');

      // Variable to store the file path
      let filePath;

      // Call the upload function to handle the file upload
      upload(req, null, async function (err) {
        if (err) {
          if(err.code?.includes('LIMIT_FILE_SIZE')) {
            logger.warn(`Error occurred uploadFileLocalStorage: ${err.message}`, err);
            return reject({ message: 'File size cannot be larger than 10 MB', code: 'LIMIT_FILE_SIZE' });
          }
          return reject(err.message);
        }

        try {
          // Create the file path
          filePath = path.join(fileTypeConstant.UPLOAD_DIR, req.file.filename);

          // Check if the uploaded file is in HEIF format (heic or heif extension)
          const isHeifImage = /\.(heic|heif)$/i.test(req.file.originalname);

          // If it's a HEIF image, convert it to JPG using the helper function
          if (isHeifImage) {
            const convertedFilePath = await convertHeifToJpg(filePath, fileTypeConstant.UPLOAD_DIR);
            // Set the filePath to the converted file path
            filePath = convertedFilePath;
          }

          // Resolve the promise with the final file path
          resolve(filePath);
        } catch (error) {
          // Reject the promise if any error occurs during conversion
          reject(error.message);
        }
      });
    });
  } catch (err) {
    logger.error('Error in uploadFileLocalStorage: ', err);
    return null;
  }
};

const deleteFileFromLocalStorage = (filePath) => {
  try {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  } catch (err) {
    logger.error('Error in deleteFileFromLocalStorage: ', err);
    return null;
  }
};

const deleteAllFilesAndFolders = (directoryPath) => {
  try {
    return new Promise((resolve, reject) => {
      fs.emptyDir(directoryPath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (err) {
    logger.error('Error in deleteAllFilesAndFolders: ', err);
    return null;
  }
};

module.exports = {
  uploadFileLocalStorage,
  deleteFileFromLocalStorage,
  deleteAllFilesAndFolders
};
