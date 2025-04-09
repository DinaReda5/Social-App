import { Router } from "express"
import { authentication } from "../../middleware/auth.js"
import { getChat } from "./service/chat.service.js"
const chatRouter = Router()


chatRouter.get("/:userId", authentication, getChat)


export default chatRouter