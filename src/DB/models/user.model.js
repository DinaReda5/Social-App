import mongoose from "mongoose";
import { accessRoles } from "../../middleware/auth.js";
export const enumGender = {
    male: "male",
    female:"female",
}


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 10,
        trim:true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim:true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        trim:true
    },
    phone: {
        type: String,
        required: true,
        trim:true
    },
    gender: {
        type: String,
        required: true,
        enum: Object.values(enumGender),
        default:enumGender.male
    },
    confirmed: {
        type: Boolean,
        default:false
    },
    isDeleted:{
        type: Boolean,
        default:false
    },
    
    role: {
        type: String,
        enum: Object.values(accessRoles),
        default:accessRoles.user
    },
    image: {
        secure_url: String,
        public_id: String
    },
    coverImage: [{
        secure_url: String,
        public_id: String
    }],
    provider: {
        type: String,
        enum: ["system","admin"],
        default:"system"
    },
    changePasswordAt: Date,
    otpEmail: String,
    otpNewEmail: String,
    tempEmail: String,
    otpPassword:String,
    viewers: [{
        userId: { type: mongoose.Types.ObjectId, ref: "User" },
        time:[Date]
    }],
    updatedBy: {
        type: mongoose.Types.ObjectId,
        ref:"User"
    }
    
}, {
    timestamps: true
})
const userModel = mongoose.models.User || mongoose.model("User", userSchema)
export default userModel
