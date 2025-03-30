import joi from "joi"
import { Types } from "mongoose"

export let customId=(value, helper)=>{
    let data = Types.ObjectId.isValid(value)
    return data?value:helper.message('id is not valid')
}
export const generalRules = {
    ObjectId: joi.string().custom(customId),
    headers: joi.object({
        authorization: joi.string(),
        'cache-control': joi.string(),
        'postman-token': joi.string(),
        'content-type':joi.string(),
        'content-length':joi.string(),
        host: joi.string(),
        'user-agent': joi.string(),
        accept: joi.string(),
        'accept-encoding': joi.string(),
        connection:joi.string()
    }),
    email: joi.string().email({ maxDomainSegments: 3 }),
    password: joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    file:joi.object(
                   {size: joi.number().positive().required(),
                    path: joi.string().required(),
                    filename: joi.string().required(),
                    destination: joi.string().required(),
                    mimetype: joi.string().required(),
                    encoding: joi.string().required(),
                    originalname: joi.string().required(),
                    fieldname: joi.string().valid("attachment", "attachments")
                // .required()
        }
            )
}