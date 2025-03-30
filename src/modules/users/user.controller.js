import { Router } from "express";
import * as US from "./user.service.js";
import * as UV from "./user.validation.js";
import { validation } from "../../middleware/validation.js";
import { fileTypes, multerHost } from "../../middleware/multer.Disk.js";
import { accessRoles, authentication, authorization } from "../../middleware/auth.js";

const userRouter = Router()
// userRouter.post("/signUp", validation(UV.signUpSchema), US.signUp)
// userRouter.post("/signUp", multerDisk([...fileTypes.image, ...fileTypes.video], "images").single("attachment"), US.signUp)
// userRouter.post("/signUp", multerHost([...fileTypes.image, ...fileTypes.video]).single("attachment"), US.signUp)
userRouter.post("/signUp",
    multerHost([...fileTypes.image, ...fileTypes.video]).array("attachment", 2),
    validation(UV.signUpSchema), US.signUp)

// userRouter.post("/signUp", multerDisk([...fileTypes.image, ...fileTypes.video], "images").array("attachments"), US.signUp)
// userRouter.post("/signUp", multerDisk([...fileTypes.image, ...fileTypes.video], "images").fields([
//     { name: "attachments", maxCount: 2 },
//     { name: "attachment", maxCount:  1},
// ]), US.signUp)

userRouter.patch("/confirmEmail",validation(UV.confirmEmailSchema), US.confirmEmail)
userRouter.post("/login", validation(UV.loginSchema), US.login)
userRouter.get("/profile/:id",validation(UV.shareProfileSchema),authentication,US.shareProfile); 
userRouter.get("/refreshToken", validation(UV.refreshTokenSchema), US.refreshToken)
userRouter.patch("/forgetPassword", validation(UV.forgetPasswordSchema), US.forgetPassword)
userRouter.patch("/resetPassword", validation(UV.resetPasswordSchema), US.resetPassword)
userRouter.patch(
  "/updateProfile",
  validation(UV.updateProfileSchema),
  authentication,
  US.updateProfile
);


userRouter.patch("/updatePassword", validation(UV.updatePasswordSchema), authentication, US.updatePassword)
userRouter.patch("/updateEmail", validation(UV.updateEmailSchema), authentication, US.updateEmail)
userRouter.patch("/replaceEmail", validation(UV.replaceEmailSchema), authentication, US.replaceEmail)
userRouter.get("/dashboard", authentication,authorization([accessRoles.admin,accessRoles.superAdmin]), US.dashboard)
userRouter.patch("/dashboard/updateRole/:userId", authentication,authorization([accessRoles.admin,accessRoles.superAdmin]), US.updateRole)








export default userRouter;