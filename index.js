import dotenv from "dotenv"
dotenv.config()
import express from "express"
import bootstrap from "./src/app.controller.js"

import { runIo } from "./src/modules/chat/chat.socket.js"

const app = express()
const port = process.env.PORT || 3000
bootstrap(app, express)

const httpServer = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

runIo(httpServer)