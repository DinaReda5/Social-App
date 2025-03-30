import commentModel from "../../DB/models/comment.model.js";
import postModel from "../../DB/models/post.model.js";
import { accessRoles } from "../../middleware/auth.js";
import cloudinary from "../../utilits/cloudinary/index.js";
import { asyncHandler } from "../../utilits/index.js";
//--------------------------------createcomment--------------------------------
export const createcomment = asyncHandler(async (req, res, next) => {
  const { refId } = req.params;
  const { onModel } = req.body;
  
  if (onModel == "Post") {
     const post =await postModel.findOne({_id:refId,isDeleted:{$exists:false}})
  if (!post) {
    return next(new Error("post not found or deleted", { cause: 404 }))
  }
  } else {
    const comment = await commentModel.findOne({ _id: refId, isDeleted: { $exists: false } })
    console.log(refId);
    
  if (!comment) {
    return next(new Error("comment not found or deleted", { cause: 404 }))
  }
  }
 
  if (req.files.length) {
    let list = []
    for (const file of req.files) {
      const { secure_url, public_id } =  await cloudinary.uploader.upload(file.path,
        {
          folder: "social-app/comments",
        })
      list.push({ secure_url, public_id })
    }
    req.body.attachments = list
  }
 const comment = await commentModel.create({...req.body,refId,onModel,userId:req.user._id})
  return res.status(200).json({ msg: "done" ,comment});
});
//--------------------------------updatecomment--------------------------------
export const updatecomment = asyncHandler(async (req, res, next) => {
  const { postId, commentId} = req.params;
  const comment = await commentModel.findOne(
    {
      _id: commentId,
      isDeleted: { $exists: false },
      postId,
      userId:req.user._id
    }).populate([{
      path: "postId"
    }])
  if (!comment || comment?.postId?.isDeleted) {
    return next(new Error("comment/post not found or deleted or unauthorized", { cause: 404 }))
  }
  if (req.files.length) {
    let list = []
    for (const file of comment.attachments) {
      await cloudinary.uploader.destroy(file.public_id)
    }
    for (const file of req.files) {
      const { secure_url, public_id } =  await cloudinary.uploader.upload(file.path,
        {
          folder: "social-app/comments",
        })
      list.push({ secure_url, public_id })
    }
    req.body.attachments = list
  }
 const newComment = await commentModel.findOneAndUpdate({_id:commentId},req.body,{new:true})
  return res.status(200).json({ msg: "done" ,comment:newComment});
});
//three people can freeze commnet owner of comment/post and admin
//--------------------------------freezeComment--------------------------------
export const freezeComment = asyncHandler(async (req, res, next) => {
  const { postId, commentId} = req.params;
  const comment = await commentModel.findOne(
    {
      _id: commentId,
      isDeleted: { $exists: false },
      postId
    }).populate([{
      path: "postId"
    }])
  if (!comment || (
    req.user.role != accessRoles.admin
    &&
    req.user._id.toString() != comment.userId.toString()
    &&
    req.user._id.toString() != comment.postId.userId.toString())
  ) {
    return next(new Error("comment/post not found or deleted or unauthorized", { cause: 404 }))
    
  }
 const newComment = await commentModel.findOneAndUpdate({_id:commentId},{isDeleted:true,deletedBy:req.user._id},{new:true})
  return res.status(200).json({ msg: "done" ,comment:newComment});
});