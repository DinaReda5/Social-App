import { chatModel } from "../../../DB/models/chat.model.js";
import { asyncHandler } from "../../../utilits/index.js";

export const getChat = asyncHandler(async (req, res, next) => {
    const { userId } = req.params
    const chat = await chatModel.findOne({
        $or: [
            { mainUser: req.user._id, subParticipant: userId },
            { mainUser: userId, subParticipant:req.user._id },
        ]
    }).populate([
        { path: "mainUser" },
        {path:"subParticipant"},
        { path: "messages.senderId" }])
    return res.status(200).json({message:"done",chat})
})