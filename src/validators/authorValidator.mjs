import { param } from "express-validator";
import mongoose from "mongoose";
import Author from "../models/Author.js";

export const validateAuthorId = [

    param("id")

        .custom(async (value, { req }) => {


            console.log(value)
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Invalid author id");
            }

            const author = await Author.findById(value);
            if (!author) {
                throw new Error("Author not found");
            }

            req.author = author;
            return true;

        })

];