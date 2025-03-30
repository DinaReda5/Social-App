import  jwt from "jsonwebtoken";

export const generateToken = async ({payload={},SECRET_KEY,option}) => {
    return jwt.sign(payload
          ,
          SECRET_KEY,
          option
        );
}