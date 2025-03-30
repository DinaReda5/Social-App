
import userModel from "../DB/models/user.model.js";
import { asyncHandler } from "../utilits/error/index.js";
import { verifyToken } from "../utilits/index.js";

export let accessRoles = {
  user: "user",
  admin: "admin",
  superAdmin:"superAdmin"
};
export const tokenTypes = {
  access: "access",
  refresh: "refresh",
};
export const decodedToken = async ({ authorization, tokenType, next }) => {
  const [prefix, token] = authorization?.split(" ") || [];
  
  if (!prefix || !token) {
    return next(new Error("invalid token", { cause: 401 }));
  }
  let ACCESS_SIGNATURE = undefined;
  let REFRESH_SIGNATURE = undefined;

  if (prefix === process.env.PREFIX_TOKEN_ADMIN) {
    ACCESS_SIGNATURE = process.env.ACCESS_SIGNATURE_ADMIN;
    REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE_ADMIN;
  } else if (prefix === process.env.PREFIX_TOKEN_USER) {
    ACCESS_SIGNATURE = process.env.ACCESS_SIGNATURE_USER;
    REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE_USER;
  } else {
    return next(new Error("ivalid token prefix", { cause: 401 }));
  }

  const decoded = await verifyToken({
    token,
    SIGNATURE_SEND_EMAIL: tokenType === tokenTypes.access ? ACCESS_SIGNATURE: REFRESH_SIGNATURE
  });

  if (!decoded?.id) {
    return next(new Error("invalid token payload", { cause: 403 }));
  }
  const user = await userModel.findById(decoded.id);
  if (!user) {
    return next(new Error("user not found", { cause: 404 }));
  }
  //   if (user?.isDeleted) {
  //     return next(new Error("user is deleted", { cause: 401 }));
  //  }
  if (parseInt(user?.changePasswordAt?.getTime() / 1000) >= decoded.iat) {
    return next(new Error("token expire login again", { cause: 401 }));
  }
  return user
};
export const authentication = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  const user = await decodedToken({
    authorization,
    tokenType: tokenTypes.access,
    next,
  });
  req.user = user;
  next();
});

export const authorization = (accessRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    if (!accessRoles.includes(req?.user?.role)) {
      return next(new Error("access denied", { cause: 401 }));
    }
    next();
  });
};
