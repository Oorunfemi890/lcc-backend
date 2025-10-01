require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const FileType = require('file-type');
const { uploadFileLocalStorage, deleteFileFromLocalStorage } = require('../helpers/multer.helper.js');
const { logger } = require('../logger/winston.js');
const resizeImage = require('../helpers/image-resize.helper.js');
const fileExtensionConstant = require('../constant/file-type.constant.js');
import { v2 as cloudinary } from 'cloudinary'

// Ensure temp directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    logger.info(`Created directory: ${dirPath}`);
  }
};

const ImageUploadMiddleware = async (req, res, next) => {
  if (process.env.LOG_ENDPOINT > 0) {
    logger.info(`Request sent to API => ${req.originalUrl}`);
  }
  try {
    // Ensure temp directory exists before any file operations
    const tempDir = path.join(process.cwd(), 'assets', 'temp_files');
    ensureDirectoryExists(tempDir);


    let pathResponse = await uploadFileLocalStorage(req);
    if (!pathResponse) {
      return res.status(500).send('Error during file upload.');
    }

    //1. Validate and sanitize the uploaded file path
    const originalName = req.file?.originalname;
    const sanitizedName = sanitizeFilePath(originalName);

    //2. Check for potentially malicious filenames
    if (!sanitizedName || sanitizedName !== originalName) {
      await deleteFileFromLocalStorage(pathResponse);
      return res.status(400).json({
        success: false,
        message: 'Invalid filename detected'
      });
    }

    // 3. NEW: Deep file type validation
    const fileBuffer = fs.readFileSync(req.file.path);
    const fileTypeResult = await FileType.fromBuffer(fileBuffer);

    if (!fileTypeResult ||
      !['image/jpeg', 'image/png', 'image/heif', 'image/heic'].includes(fileTypeResult.mime)) {
      await deleteFileFromLocalStorage(pathResponse);
      return res.status(400).json({
        success: false,
        message: 'Invalid file type detected'
      });
    }


    // Check if the file extension is 'heif' (heic or heif)
    const isHeifImage = /\.(heic|heif)$/i.test(req.file.originalname);

    // Set the localFilePath using the ternary operator
    let localFilePath = isHeifImage ? pathResponse : req.file.path;


    // Verify file exists before proceeding
    logger.info(`Checking file existence for: ${localFilePath}`);
    if (!fs.existsSync(localFilePath)) {
      logger.error(`File does not exist: ${localFilePath}`);
      return res.status(404).send('File not found.');
    }

    // Check if the file size is greater than 2MB
    logger.info(`Checking file size for: ${localFilePath}`);
    const fileSizeInBytes = fs.statSync(localFilePath).size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

    if (fileSizeInMB > fileExtensionConstant.MAX_IMAGE_FILE_SIZE_IN_MB) {
      const fileSizeResponse = await handleFileSize(localFilePath);
      if (fileSizeResponse.isError) {
        return res.status(fileSizeResponse.statusCode)
          .send({ message: fileSizeResponse.message });
      }

      localFilePath = fileSizeResponse.localFilePath;
    }

    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
    const extensionToUse = fileExtensionConstant.ALLOWED_IMAGE_EXTENSIONS.includes(fileExtension)
      ? fileExtension
      : fileExtensionConstant.DEFAULT_IMAGE_EXTENSION;

    const key = uuidv4() + '.' + extensionToUse;

    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
      secure: true
    });



    const results = await cloudinary.uploader.upload(localFilePath)

    await handleCloudinaryFileUpload(fileSizeInMB, isHeifImage, localFilePath, pathResponse, req);


    // Store the file URL in the req object for access in the route handler
    req.fileUrl = results.secure_url;

    next();

  } catch (err) {
    if (err.code?.includes('LIMIT_FILE_SIZE')) {
      logger.warn(err);
      return res.status(400).send({ message: 'File size cannot be larger than 10 MB' });
    }
    res.status(400).send(err.message);
  }
};

const handleFileSize = async (localFilePath) => {
  const originalPath = localFilePath;
  try {
    const resizeResult = await resizeImage(localFilePath);
    // Check if resizing failed due to unsupported image format
    if (resizeResult && resizeResult.error) {
      await deleteFileFromLocalStorage(originalPath);
      return {
        isError: true,
        statusCode: resizeResult.statusCode,
        message: resizeResult.message,
      };
    }
    localFilePath = resizeResult;
    // Verify resized file exists
    if (!fs.existsSync(localFilePath)) {
      logger.error(`Resized file not created: ${localFilePath}`);
      // Continue with original file instead of returning error
      localFilePath = originalPath;
    }
  } catch (resizeError) {
    logger.error('Error during image resize:', resizeError);
    // Continue with original file instead of returning error
    localFilePath = originalPath;
  }

  return {
    isError: false,
    localFilePath
  };
};

const handleCloudinaryFileUpload = async (fileSizeInMB, isHeifImage, localFilePath, pathResponse, req) => {
  try {
    // Deleting old files - wrapped in try-catch to prevent cleanup errors from affecting the upload
    if (fileSizeInMB > 2) {
      if (isHeifImage && localFilePath != pathResponse) {
        await deleteFileFromLocalStorage(pathResponse);
      }
      if (localFilePath != req.file.path) {
        await deleteFileFromLocalStorage(req.file.path);
      }
    }
    // Always try to delete the local file
    if (fs.existsSync(localFilePath)) {
      await deleteFileFromLocalStorage(localFilePath);
    }
  } catch (cleanupError) {
    // Log cleanup errors but continue processing
    logger.error('Error during file cleanup:', cleanupError);
  }
};
module.exports = ImageUploadMiddleware
