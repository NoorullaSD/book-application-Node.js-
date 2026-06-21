import { param } from "express-validator";
import mongoose from "mongoose";
import Book from "../models/Book.js";

export const validateBookId = [

    param("id")

        .custom(async (value, { req }) => {

            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Invalid book id");
            }

            const book = await Book.findById(value);
            if (!book) {
                throw new Error("Book not found");
            }

            req.book = book;
            return true;

        })

];