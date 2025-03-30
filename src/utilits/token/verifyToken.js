import  jwt from "jsonwebtoken";

export const verifyToken = async ({token,SIGNATURE_SEND_EMAIL}) => {
    return jwt.verify(token,SIGNATURE_SEND_EMAIL);
}