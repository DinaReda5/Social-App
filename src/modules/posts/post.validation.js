import joi from "joi";
import { generalRules } from "../../utilits/index.js";

export const createPostSchema = joi.object({
    content: joi.string().min(3).required(),
    files:joi.array().items(generalRules.file)
})
export const updatePostSchema = joi.object({
    postId:generalRules.ObjectId.required(),
    content: joi.string().min(3),
    files:joi.array().items(generalRules.file)
})
export const freezePostSchema = joi.object({
    postId:generalRules.ObjectId.required(),
})