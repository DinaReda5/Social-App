import CryptoJS from "crypto-js";
export const decrypt = async ({ key, SIGNATURE = process.env.SIGNATURE }) => {
    return CryptoJS.AES.decrypt(
       key,
    SIGNATURE)
        .toString(CryptoJS.enc.Utf8
  );
};
