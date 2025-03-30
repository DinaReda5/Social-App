import { Router } from "express";
import { fileTypes, multerHost } from "../../middleware/multer.Disk.js";
import { validation } from "../../middleware/validation.js";
import * as PV  from "./post.validation.js";
import * as PS  from  "./post.service.js";
import { authentication } from "../../middleware/auth.js";
import commentRouter from "../comments/comment.controller.js";

const postRouter = Router()
postRouter.use("/:refId/comments",commentRouter)
postRouter.post("/",
    multerHost(fileTypes.image).array("attachments", 5),
    validation(PV.createPostSchema),
    authentication,
    PS.createPost
)
postRouter.patch("/:postId",
    authentication,
    multerHost(fileTypes.image).array("attachments", 5),
    validation(PV.updatePostSchema),
    PS.updatePost
)
postRouter.delete("/freezePost/:postId",
    authentication,
    validation(PV.freezePostSchema),
    PS.freezePost
)
postRouter.delete("/unfreezePost/:postId",
    authentication,
    validation(PV.freezePostSchema),
    PS.unfreezePost
)
postRouter.patch("/likePost/:postId",
    authentication,
    validation(PV.freezePostSchema),
    PS.likePost
)
postRouter.get("/",
    // authentication,
    PS.getPosts
)
export default postRouter