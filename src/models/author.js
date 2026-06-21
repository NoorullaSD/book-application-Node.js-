import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    country: String
});

export default mongoose.model(
    "Author",
    authorSchema
);