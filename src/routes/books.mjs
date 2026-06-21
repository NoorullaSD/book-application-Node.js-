import express from "express";
import Book from "../models/Book.js";
import { getBookIndex } from "../utils/bookHelpers.mjs";
import { validateBookId } from "../validators/bookValidator.mjs";
import { handleValidation } from "../middleware/handleValidation.mjs";
import passport from "passport";
import { validationResult } from "express-validator";

const router = express.Router();

const getAllBook = async function (req, res) {

    let books
    let { filter, value } = req.query;

    if (filter && value) {
        books = await Book.find({
            [filter]: {
                $regex: value,
                $options: "i"
            }
        })

    }
    else {
        books = await Book.find();
    }
    res.status(200).send(books);
}

const getBookId = async (req, res, next) => {
    const validErrors = validationResult(req);

    try {
        let result = req.book

        if (!result) {
            const error = new Error(validErrors.errors[0].msg);
            error.statusCode = 404;
            throw error;
        }

        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
}

const newBook = async (req, res) => {
    const book = new Book(req.body);
    await book.save();

    res.status(201).send({
        message: "New book added",
        data: book
    });
}

const patchBookUpdate = async (req, res, next) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            {
                new: true,
                runValidators: true
            }
        );
        res.status(200).json({
            message: "Book updated successfully",
            data: updatedBook
        });
    }
    catch (error) {
        next(error);
    }
}

const putBookUpdate = async (req, res, next) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                category: req.body.category,
                publishedYear: req.body.publishedYear,
                available: req.body.available,
                authorId: req.body.authorId
            },
            {
                new: true,
                runValidators: true
            }
        );
        res.status(200).json({
            message: "Book updated successfully",
            data: updatedBook
        });

    }
    catch (error) {
        next(error);
    }
}

const removeBook = async (req, res, next) => {
    try {
        await Book.findByIdAndDelete(
            req.params.id
        );
        res.status(200).json({
            message: "Book deleted successfully"
        });
    }
    catch (error) {
        next(error);
    }
}




router.get("/all/books", passport.authenticate("jwt", { session: false }), getAllBook);

router.get("/book/:id", passport.authenticate("jwt", { session: false }), validateBookId, getBookId);

router.post("/new/book", passport.authenticate("jwt", { session: false }), newBook);

router.patch("/update/book/:id", passport.authenticate("jwt", { session: false }), validateBookId, handleValidation, patchBookUpdate);

router.put("/update/book/:id", passport.authenticate("jwt", { session: false }), validateBookId, handleValidation, putBookUpdate);

router.delete("/delete/book/:id", validateBookId, handleValidation, removeBook);


export default router;