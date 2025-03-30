import postModel from "../../DB/models/post.model.js";
import { accessRoles } from "../../middleware/auth.js";
import cloudinary from "../../utilits/cloudinary/index.js";
import { pagination } from "../../utilits/features/index.js";
import { asyncHandler } from "../../utilits/index.js";
//--------------------------------createPost--------------------------------
export const createPost = asyncHandler(async (req, res, next) => {
  if (req?.files.length) {
    const images = [];
    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: "social-app/post",
        }
      );
      images.push({ secure_url, public_id });
    }
    req.body.attachments = images;
  }
  const post = await postModel.create({ ...req.body, userId: req.user._id });
  return res.status(200).json({ msg: "done", post });
});
//--------------------------------updatePost--------------------------------
export const updatePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const post = await postModel.findOne({
    _id: postId,
    isDeleted: { $exists: false },
    userId: req.user._id,
  });
  if (!post) {
    return next(new Error("post not found or un authorized", { cause: 404 }));
  }
  if (req?.files?.length) {
    for (const file of post.attachments) {
      await cloudinary.uploader.destroy(file.public_id);
    }
    const images = [];
    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: "social-app/post",
        }
      );
      images.push({ secure_url, public_id });
    }
    post.attachments = images;
  }
  if (req.body.content) {
    post.content = req.body.content;
  }
  await post.save();
  return res.status(200).json({ msg: "done" });
});
//--------------------------------freezePost--------------------------------
export const freezePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const condition =req.user.role === accessRoles.admin ? {} : { userId: req.user._id };
  const post = await postModel.findOneAndUpdate(
    { _id: postId, isDeleted: { $exists: false }, ...condition },
    { isDeleted: true, deletedBy: req.user._id },
    {new:true}
  );
  if (!post) {
    return next(new Error("post not found or un authorized", { cause: 404 }));
  }

  return res.status(200).json({ msg: "done", post });
});
//--------------------------------unfreezePost--------------------------------
export const unfreezePost = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;

    const post = await postModel.findOneAndUpdate(
      { _id: postId, isDeleted: { $exists: true },deletedBy:req.user._id },
        { $unset: { deletedBy: 0, isDeleted: 0} },
      {new:true}
    );
 
    if (!post) {
      return next(new Error("post not found or un authorized", { cause: 404 }));
    }
   
    return res.status(200).json({ msg: "done", post });
});
//--------------------------------likePost--------------------------------
export const likePost = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;

    const post = await postModel.findOne({ _id: postId, isDeleted: { $exists: false } ,likes:{$in:[req.user._id]}})
    let updatedpost;
    let action;
    if (post) {
        updatedpost=await postModel.findOneAndUpdate(
              { _id: postId, isDeleted: { $exists: false }},
                { $pull:{likes:req.user._id} },
              {new:true}
        );
        action ="unlike"
    } else {
        updatedpost=await postModel.findOneAndUpdate(
            { _id: postId, isDeleted: { $exists: false }},
              { $addToSet:{likes:req.user._id} },
            {new:true}
      );
      action ="like"
    }
    if (!updatedpost) {
    return next(new Error("post not found or deleted", { cause: 404 }));
        
    }
   
    return res.status(200).json({ msg: action, updatedpost });
});
//--------------------------------getPosts--------------------------------
export const getPosts = asyncHandler(async (req, res, next) => {
  const { data, _page } = await pagination({ page: req.query.page ,model :postModel })
  console.log({ data, _page });
  
//   const posts = await postModel.find({}).populate([
//     {
//         path: "comment",
//        match:{commentId:{$exists:false}},
//        populate:{path:"reply"}
//     }
// ])
//     return res.status(200).json({ msg: "done", posts });
  return res.status(200).json({ msg:"donee",page:_page,posts:data })
});

