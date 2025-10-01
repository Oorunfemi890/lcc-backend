const sharp = require('sharp');
const logger = require('../logger/winston');
const path = require('path');

const resizeImage = async (imagePath, quality = 40) => {
  try {
    const extname = path.extname(imagePath);
    const resizedImagePath = imagePath.replace(extname, `+resized${extname}`);

    // Get the image metadata to determine its dimensions
    const metadata = await sharp(imagePath, { failOn: 'truncated' }).metadata();
    const { width, height } = metadata;

    let resizeWidth = width; // Maintain original width for both vertical and horizontal images
    let resizeHeight; // Maintain original height for both vertical and horizontal images

    // Check if the image is vertical (height is greater than width)
    if (height > width) {
      // Calculate the new height based on the aspect ratio
      resizeHeight = Math.round((resizeWidth * height) / width);
    } else {
      // For horizontal images, no need to resize height
      resizeHeight = height;
    }

    await sharp(imagePath, { failOn: 'truncated' })
      .resize(resizeWidth, resizeHeight)
      .jpeg({ quality })
      .toFile(resizedImagePath);

    // Return the resized image path
    return resizedImagePath;
  } catch (err) {
     // Check if the error message is related to unsupported image format
     if (err.message.includes('unsupported image format')) {
      // Return a descriptive error response for unsupported format
      return {
        error: true,
        statusCode: 415,
        message: 'Unsupported image format. Please upload a supported image type.'
      };
    }
    return imagePath;
  }
};

module.exports = resizeImage;
