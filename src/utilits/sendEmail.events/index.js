import { EventEmitter } from "events";
import { sendEmail } from "../../service/sendEmail.js";
import { nanoid, customAlphabet } from 'nanoid'
import {userModel} from "../../DB/models/user.model.js";
import { Hash } from "../hash/hash.js";
import {Html} from "../../service/template-email.js"
export const eventEmitter = new EventEmitter();

eventEmitter.on("sendEmail", async (data) => {
  //confirm email
  const { email , id} = data;
  const otp = customAlphabet("0123456789", 4)()
  const hashed = await Hash({ key: otp, SALT_ROUNDS: process.env.SALT_ROUNDS })
  await userModel.updateOne({email,_id:id},{otpEmail:hashed})
  await sendEmail(email, "confirm email", Html({code:otp,action:"Email Confirmation"}));
});

eventEmitter.on("sendNewEmail", async (data) => {
  //confirm email
  const { email ,id } = data;
  const otp = customAlphabet("0123456789", 4)()
  const hashed = await Hash({ key: otp, SALT_ROUNDS: process.env.SALT_ROUNDS })
  await userModel.updateOne({tempEmail:email,_id:id},{otpNewEmail:hashed})
  await sendEmail(email, "new confirm email", Html({code:otp,action:"New Email Confirmation"}));
});

eventEmitter.on("forgetPassword", async (data) => {
  //confirm email
  const { email } = data;
  const otp = customAlphabet("0123456789", 4)()
  const hashed = await Hash({ key: otp, SALT_ROUNDS: process.env.SALT_ROUNDS })
  await userModel.updateOne({email},{otpPassword:hashed})
  await sendEmail(email, "Forget Password", Html({code:otp,action:"Forget Password"}));
});