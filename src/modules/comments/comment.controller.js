import { Router } from "express";
import { fileTypes, multerHost } from "../../middleware/multer.Disk.js";
import { validation } from "../../middleware/validation.js";
import * as CV  from "./comment.validation.js";
import * as CS  from  "./comment.service.js";
import { authentication } from "../../middleware/auth.js";

const commentRouter = Router({mergeParams:true})
commentRouter.post("/",
    multerHost(fileTypes.image).array("attachments", 5),
    validation(CV.createcommentSchema),
    authentication,
    CS.createcomment
)
commentRouter.patch("/:commentId",
    multerHost(fileTypes.image).array("attachments", 5),
    validation(CV.updateCommentSchema),
    authentication,
    CS.updatecomment
)
commentRouter.delete("/:commentId",
    validation(CV.freezeCommentSchema),
    authentication,
    CS.freezeComment
)
export default commentRouter