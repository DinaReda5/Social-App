import postModel from "../../DB/models/post.model.js";
import userModel from "../../DB/models/user.model.js";
import {
  accessRoles,
  decodedToken,
  tokenTypes,
} from "../../middleware/auth.js";
import cloudinary from "../../utilits/cloudinary/index.js";
import {
  asyncHandler,
  eventEmitter,
  Hash,
  encrypt,
  generateToken,
  verifyToken,
  Compare,
} from "../../utilits/index.js";
import path from "path";

// ------------------------------signUp----------------------------------
export const signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone } = req.body;
  // //check email
  const emailExist = await userModel.findOne({ email });
  if (emailExist) {
    return next(new Error("email already exists", { cause: 409 }));
  }

  // if (!req?.files.length) {
  //   return next(new Error("please enter a photo", { cause: 409 }));
  // }
  // let imgPaths = []
  // for (const file of req.files.attachments) {
  //   imgPaths.push(path.resolve(file.path))
  // }
  let arrPaths = [];
  for (const file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: "social-app/users",
        // ,public_id
        // ,use_filename:true
        // ,unique_filename:false
        // ,resource_type:"image"
      }
    );
    // arrPaths.push({ secure_url, public_id })
  }
  // encrypt phone
  const encryptedePhone = await encrypt({
    key: phone,
    SIGNATURE: process.env.SIGNATURE,
  });
  //hashing password
  const hash = await Hash({
    key: password,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
  });
  //send email
  // eventEmitter.emit("sendEmail", { email });
  //send DB
  const user = await userModel.create({
    name,
    email,
    password: hash,
    phone: encryptedePhone,
    // coverImage: arrPaths,
    // image:{secure_url,public_id}
  });
  return res.status(201).json({ msg: "done and check your email", user });
});
// ------------------------------confirmEmail----------------------------------
export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;
  //check email
  const user = await userModel.findOne({ email, confirmed: false });
  if (!user) {
    return next(
      new Error("email not exists or the user aready confirmed", { cause: 404 })
    );
  }
  const match = await Compare({ key: code, hashed: user.otpEmail });
  if (!match) {
    return next(new Error("the code is not correct", { cause: 400 }));
  }
  await userModel.updateOne(
    { email },
    { confirmed: true, $unset: { otpEmail: 0 } }
  );
  return res.status(201).json({ msg: "done" });
});
// ------------------------------login----------------------------------
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //check email
  const user = await userModel.findOne({
    email,
    confirmed: true,
    provider: "system",
  });
  if (!user) {
    return next(
      new Error("email not exists or the user not confirmed yet", {
        cause: 404,
      })
    );
  }

  if (!(await Compare({ key: password, hashed: user.password }))) {
    return next(new Error("the password is not correct", { cause: 400 }));
  }
  const accessToken = await generateToken({
    payload: { email, id: user._id },
    SECRET_KEY:
      user.role == accessRoles.user
        ? process.env.ACCESS_SIGNATURE_USER
        : process.env.ACCESS_SIGNATURE_ADMIN,
    option: { expiresIn: "1d" },
  });

  const refreshToken = await generateToken({
    payload: { email, id: user._id },
    SECRET_KEY:
      user.role == accessRoles.user
        ? process.env.REFRESH_SIGNATURE_USER
        : process.env.REFRESH_SIGNATURE_ADMIN,
    option: { expiresIn: "1w" },
  });
  return res.status(201).json({ msg: "done", accessToken, refreshToken });
});
// ------------------------------refreshToken----------------------------------
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { authorization } = req.body;
  const user = await decodedToken({
    authorization,
    tokenType: tokenTypes.refresh,
    next,
  });

  const accessToken = await generateToken({
    payload: { email: user.email, id: user._id },
    SECRET_KEY:
      user.role == accessRoles.user
        ? process.env.ACCESS_SIGNATURE_USER
        : process.env.ACCESS_SIGNATURE_ADMIN,
    option: { expiresIn: "1d" },
  });

  return res.status(201).json({ msg: "done", accessToken });
});
// ------------------------------forgetPassword----------------------------------
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  //check email
  const user = await userModel.findOne({ email, isDeleted: false });
  if (!user) {
    return next(
      new Error("email not exists or the user not found", { cause: 404 })
    );
  }
  eventEmitter.emit("forgetPassword", { email });
  return res.status(201).json({ msg: "done" });
});
// ------------------------------resetPassword----------------------------------
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, code, newPassword } = req.body;
  //check email
  const user = await userModel.findOne({ email, isDeleted: false });
  if (!user) {
    return next(new Error("email not exists ", { cause: 404 }));
  }
  const match = await Compare({ key: code, hashed: user.otpPassword });
  if (!match) {
    return next(new Error("the code is not correct", { cause: 404 }));
  }
  const hash = await Hash({
    key: newPassword,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
  });
  await userModel.updateOne(
    { email },
    { password: hash, confirmed: true, $unset: { otpPassword: 0 } }
  );
  return res.status(201).json({ msg: "done" });
});
// ------------------------------updateProfile----------------------------------
export const updateProfile = asyncHandler(async (req, res, next) => {
  if (req.body.phone) {
    req.body.phone = await encrypt({
      key: req.body.phone,
      SIGNATURE: process.env.SIGNATURE,
    });
  }
  if (req.file) {
    await cloudinary.uploader.destroy(req.user.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "social-app/users",
      }
    );
    req.body.image = { secure_url, public_id };
  }
  const user = await userModel.findByIdAndUpdate(
    { _id: req.user._id },
    req.body,
    { new: true }
  );
  return res.status(201).json({ msg: "done", user });
});
// ------------------------------updatePassword----------------------------------
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!(await Compare({ key: oldPassword, hashed: req.user.password }))) {
    return next(new Error("invalid old password", { cause: 400 }));
  }
  const hash = await Hash({
    key: newPassword,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
  });
  const user = await userModel.findByIdAndUpdate(
    { _id: req.user._id },
    { password: hash, changePasswordAt: Date.now() },
    { new: true }
  );
  return res.status(201).json({ msg: "done", user });
});
// ------------------------------shareProfile----------------------------------
export const shareProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findOne({ _id: id, isDeleted: false });
  if (!user) {
    return next(new Error("email not exist or deleted", { cause: 404 }));
  }
  if (req.user._id.toString() === id) {
    return res.status(200).json({ msg: "done", user: req.user });
  }
  const emailExist = user.viewers.find((viewer) => {
    return viewer.userId.toString() === req.user._id.toString();
  });
  if (emailExist) {
    emailExist.time.push(Date.now());
    if (emailExist.time.length > 5) {
      emailExist.time = emailExist.time.slice(-5);
    }
  } else {
    user.viewers.push({ userId: req.user._id, time: [Date.now()] });
  }
  await user.save();
  return res.status(201).json({ msg: "done", user });
});
// ------------------------------updateEmail----------------------------------
export const updateEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    return next(new Error("email aready exist", { cause: 409 }));
  }
  await userModel.updateOne({ _id: req.user._id }, { tempEmail: email });
  //send email
  eventEmitter.emit("sendEmail", { email: req.user.email, id: req.user._id });
  eventEmitter.emit("sendNewEmail", { email, id: req.user._id });
  return res.status(201).json({ msg: "done" });
});
// ------------------------------replaceEmail----------------------------------
export const replaceEmail = asyncHandler(async (req, res, next) => {
  const { newCode, oldCode } = req.body;
  const user = await userModel.findOne({ _id:req.user._id,isDeleted:false});
  if (!user) {
    return next(new Error("email not exist or deleted", { cause: 409 }));
  }
  if (!await Compare({ key: oldCode, hashed: user.otpEmail })) {
    return next(new Error("invalid old code", { cause: 409 }));
  }
  if (!await Compare({ key: newCode, hashed:user.otpNewEmail })) {
    return next(new Error("invalid new code", { cause: 409 }));
  }
  await userModel.updateOne({ _id: req.user._id },{
      email: user.tempEmail,
      $unset: {
        tempEmail: 0,
        otpEmail: 0,
        otpNewEmail: 0,
    },
    changePasswordAt:Date.now()
  }
  );
  return res.status(201).json({ msg: "done" });
});
// ------------------------------dashboard----------------------------------
export const dashboard = asyncHandler(async (req, res, next) => {
 
  const data = await Promise.allSettled([
    userModel.find(),
    postModel.find()
  ])
  return res.status(201).json({ msg: "done" ,data});
});
// ------------------------------updateRole----------------------------------
export const updateRole = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { role } = req.body;
  const data = req.user.role === accessRoles.superAdmin ? { role: { $nin: [accessRoles.superAdmin] } } :
    {role:{$nin:[accessRoles.admin,accessRoles.superAdmin]}}
  const user = await userModel.findOneAndUpdate({
    _id: userId,
    isDeleted: false,
    ...data
  }, {
    role,
    updatedBy:req.user._id
  }, {
    new:true
  })
  if (!user) {
    return next(new Error("user not found or deleted or unauthorized", { cause: 404 }));
}
  return res.status(201).json({ msg: "done" ,user});
});
