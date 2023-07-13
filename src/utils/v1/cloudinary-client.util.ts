import cloudRef from "cloudinary";
const { v2: cloudinaryV2 } = cloudRef;
cloudinaryV2.config({
  cloud_name: process.env.CLOUD_NAME_TEST!,
  api_key: process.env.CLOUD_API_KEY_TEST!,
  api_secret: process.env.CLOUD_API_SECRET_TEST!,
});
export default cloudinaryV2;
