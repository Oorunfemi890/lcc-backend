import { v2 as cloudinary } from 'cloudinary';
require("dotenv").config();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
});

export const uploadFile = (path, filename) => {
    return new Promise(async (resolve, reject) => {
        await cloudinary.uploader.upload(path, {
            public_id: `relattionGift/products/${filename.split('.')[0]}`
        }, async function (error, result) {
            try {
                if (error)
                    reject(error);
                resolve(result)
            } catch (e) {
                throw e;

            }
        })
    })
}
