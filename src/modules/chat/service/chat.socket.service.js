import { connectionUser } from "../../../DB/models/user.model.js";
import { authSocket } from "../../../middleware/auth.js";

export const registerAccount =async (socket)=>{
    const data = await authSocket({ socket })
    if (data.statusCode != 200) {
       return socket.emit("authError",data)
    } 
    console.log(connectionUser);
    connectionUser.set(data.user._id.toString(),socket.id)
    console.log(connectionUser);
    return "done"
}
export const logOut =async (socket)=>{
    return socket.on("disconnect", async() => {
    const data = await authSocket({ socket })
    if (data.statusCode != 200) {
       return socket.emit("authError",data)
    } 
    connectionUser.delete(data.user._id.toString(),socket.id)
    console.log(connectionUser);
    return "done"
  })
}
