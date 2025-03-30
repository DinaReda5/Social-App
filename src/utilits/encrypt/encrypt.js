import CryptoJS from "crypto-js";
export const encrypt = async ({ key, SIGNATURE = process.env.SIGNATURE }) => {
  return CryptoJS.AES.encrypt(key,SIGNATURE).toString();
};
