import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
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
    refId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath:"onModel"
    },
    onModel: {
        type: String,
        enum: ["Post", "Comment"],
        required:true
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
    toObject: { virtuals: true },
    timestamps: true
});
commentSchema.virtual("reply",{
    ref: "Comment",
    localField: "_id",
    foreignField:"refId"
})
const commentModel = mongoose.models.Comment || mongoose.model("Comment", commentSchema)
export default commentModel