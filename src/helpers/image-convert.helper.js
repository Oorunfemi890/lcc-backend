const fs = require('fs-extra');
const FileType = require('file-type');
const path = require('path');
const logger = require('../logger/winston');
const heicConvert = require('heic-convert');


async function convertHeifToJpg (heifFilePath, outputDirectory) {
  try {
    // Read the HEIF file data
    const heifData = await fs.readFile(heifFilePath);

    // Convert the HEIF data to JPEG format
    const jpgData = await heicConvert({
      buffer: heifData,
      format: 'JPEG',
    });

    // Create the output directory if it doesn't exist
    await fs.ensureDir(outputDirectory);

    // Generate a new file path for the converted JPG
    const jpgFileName = `${Date.now()}.jpg`;
    const jpgFilePath = path.join(outputDirectory, jpgFileName);

    // Write the converted JPG data to the new file
    await fs.writeFile(jpgFilePath, jpgData);

    return jpgFilePath;
  } catch (err) {
    if (err.message?.includes('input buffer is not a HEIC image')) {
      try {
        // Read the HEIF file data
        const heifData = await fs.readFile(heifFilePath);
        const fileType = await FileType.fromBuffer(heifData);

        if (fileType) {
          // Create the output directory if it doesn't exist
          await fs.ensureDir(outputDirectory);

          // Generate a new file path with the correct extension
          const newFileName = `${Date.now()}.${fileType.ext}`;
          const newFilePath = path.join(outputDirectory, newFileName);

          // Write the data to the new file
          await fs.writeFile(newFilePath, heifData);

          return newFilePath;
        }
      } catch (innerErr) {
        logger.error('Error correcting file format: ', innerErr);
      }
    } else {
      logger.error('Error converting HEIF to JPG: ', err);
    }
    return heifFilePath;
  }
}

module.exports = {
  convertHeifToJpg
};

