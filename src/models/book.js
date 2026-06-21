import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        category: String,

        publishedYear: Number,

        available: {
            type: Boolean,
            default: true
        },

        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Author"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "Book",
    bookSchema
);