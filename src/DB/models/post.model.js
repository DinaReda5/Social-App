import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        minLength: 3,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    attachments: [{
        secure_url: String,
        public_id: String,
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    isDeleted: Boolean,
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    toJSON: { virtuals: true },
    toObject:{ virtuals: true },
    timestamps: true
});
postSchema.virtual("comment",{
    ref: "Comment",
    localField: "_id",
    foreignField:"refId"
})
const postModel = mongoose.models.Post || mongoose.model("Post", postSchema)
export default postModel