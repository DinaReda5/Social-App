import {Server} from "socket.io"
import { logOut, registerAccount } from "./service/chat.socket.service.js";
import { sendMessage } from "./service/message.service.js";


export const runIo = (httpServer) => {
    const io = new Server(httpServer, {
        cors:"*",
    })
   
   
    io.on("connection",async (socket) => {
        console.log(socket.id);
        await registerAccount(socket);
        await sendMessage(socket)
        await logOut(socket);
    
    })
}