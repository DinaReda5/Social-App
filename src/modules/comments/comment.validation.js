import joi from "joi";
import { generalRules } from "../../utilits/index.js";

export const createcommentSchema = joi.object({
    content: joi.string().min(3).required(),
    refId: generalRules.ObjectId.required(),
    onModel:joi.string().valid("Post", "Comment").required(),
    files:joi.array().items(generalRules.file)
})
export const updateCommentSchema = joi.object({
    content: joi.string().min(3),
    postId: generalRules.ObjectId,
    commentId:generalRules.ObjectId,
    files:joi.array().items(generalRules.file)
})
export const freezeCommentSchema = joi.object({
    postId: generalRules.ObjectId.required(),
    commentId:generalRules.ObjectId.required(),
})