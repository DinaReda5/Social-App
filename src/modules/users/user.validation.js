import joi from "joi";
import { generalRules } from "../../utilits/generalRules/index.js";
import { enumGender } from "../../DB/models/user.model.js";
import { authorization } from "../../middleware/auth.js";

export const signUpSchema = joi
  .object({
    name: joi
      .string()
      .alphanum()
      .min(3)
      .max(30)
      .messages({ "string.min": "the name is short" })
      .required(),
    email: generalRules.email.required(),
    password: generalRules.password.required(),
    cPassword: generalRules.password.valid(joi.ref("password")).required(),
    gender: joi.string().valid(enumGender.male, enumGender.female),
    phone: joi
      .string()
      .regex(/^01[0125][0-9]{8}$/)
      .required(),
    files: generalRules.file,
    // .required()
  })
  .required();

export const confirmEmailSchema = joi
  .object({
    email: generalRules.email.required(),
    code: joi.string().length(4).required(),
  })
  .required();

export const loginSchema = joi
  .object({
    email: generalRules.email.required(),
    password: generalRules.password.required(),
  })
  .required();

export const refreshTokenSchema = joi
  .object({
    authorization: joi.string().required(),
  })
  .required();

export const forgetPasswordSchema = joi
  .object({
    email: generalRules.email.required(),
  })
  .required();

export const resetPasswordSchema = joi
  .object({
    email: generalRules.email.required(),
    code: joi.string().length(4).required(),
    newPassword: generalRules.password.required(),
    cPassword: generalRules.password.valid(joi.ref("newPassword")).required(),
  })
  .required();

export const updateProfileSchema = joi
  .object({
    name: joi
      .string()
      .alphanum()
      .min(3)
      .max(30)
      .messages({ "string.min": "the name is short" }),
    gender: joi.string().valid(enumGender.male, enumGender.female),
    phone: joi.string().regex(/^01[0125][0-9]{8}$/),
    file: generalRules.file,
    // files:joi.array().items(generalRules.file.required())
    // files: joi.object({
    //     attachment: joi.array().items(generalRules.file.required()).required(),
    //     attachments: joi.array().items(generalRules.file.required()).required(),

    // })
  })
  .required();

export const updatePasswordSchema = joi.object({
  oldPassword: generalRules.password.required(),
  newPassword: generalRules.password.required(),
  cPassword: generalRules.password.valid(joi.ref("newPassword")).required(),
});
export const shareProfileSchema = joi.object({
  id: generalRules.ObjectId.required(),
});
export const updateEmailSchema = joi.object({
  email: generalRules.email.required(),
});
export const replaceEmailSchema = joi.object({
    oldCode: joi.string().length(4).required(),
    newCode: joi.string().length(4).required(),
  });
