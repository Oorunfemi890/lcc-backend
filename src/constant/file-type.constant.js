const VALID_IMAGE_MINE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff', 'image/webp', 'image/heic', 'image/heif'];
const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'png', 'jpeg', 'heic', 'heif']; // Accept the original HEIF format in case of a potential error in convert part
const DEFAULT_IMAGE_EXTENSION = 'jpg';
const MAX_IMAGE_FILE_SIZE_IN_MB = 2; // 2MB
const MAX_IMAGE_WIDTH = 1920;
const MAX_IMAGE_HEIGHT = 1080;
const UPLOAD_DIR = './assets/temp_files';
const JPG_MAGIC_NUMBER = 'ffd8';
const PNG_MAGIC_NUMBER = '89504e47';
const GIF_MAGIC_NUMBER = '47494638';
const BMP_MAGIC_NUMBER = '424d';
const WEBP_MAGIC_NUMBER = '52494646';
const HEIF_MAGIC_NUMBERS = ['4d4d002a', '49492a00']; // TIFF and HEIF
const HEIC_MAGIC_NUMBERS = '000000186674797068656963';


module.exports = Object.freeze(
    {
        VALID_IMAGE_MINE_TYPES,
        ALLOWED_IMAGE_EXTENSIONS,
        DEFAULT_IMAGE_EXTENSION,
        UPLOAD_DIR,
        MAX_IMAGE_FILE_SIZE_IN_MB,
        MAX_IMAGE_WIDTH,
        MAX_IMAGE_HEIGHT,
        JPG_MAGIC_NUMBER,
        PNG_MAGIC_NUMBER,
        GIF_MAGIC_NUMBER,
        BMP_MAGIC_NUMBER,
        WEBP_MAGIC_NUMBER,
        HEIF_MAGIC_NUMBERS,
        HEIC_MAGIC_NUMBERS
    }
);
