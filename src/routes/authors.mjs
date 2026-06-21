import express from "express"
import { books } from "../utils/constants.mjs"
import { authors } from "../utils/constants.mjs"
import { validateBookId } from "../validators/bookValidator.mjs";
import { validateAuthorId } from "../validators/authorValidator.mjs";
import { handleValidation } from "../middleware/handleValidation.mjs";
import Author from "../models/Author.js";
import Book from "../models/Book.js";
import { validationResult } from "express-validator";

const router = express.Router();

const getAllAuthors = async function (req, res) {

    let result
    let { filter, value } = req.query;

    if (filter && value) {
        result = await Author.find({
            [filter]: {
                $regex: value,
                $options: "i"
            }
        })
    }
    else {
        result = await Author.find()
    }
    res.status(200).send(result);
}

const getAuthorById = async function (req, res, next) {

    const validErrors = validationResult(req);

    try {
        let result = req.author

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

const getAuthorBook = async (req, res) => {
    let { filter, value } = req.query
    let book
    console.log(filter, value)
    if (filter && value) {

        let author = await Author.find({
            [filter]: {
                $regex: value,
                $options: "i"
            }
        })

        if (!author) {
            return res.status(401).send({
                message: "Author not found"
            })
        }

        book = await Book.find({
            authorId: author[0]["_id"]
        }).populate("authorId");

        console.log(book)

        if (!book) {
            return res.status(401).send({
                message: "Book not found"
            })
        }
    }



    return res.status(200).send(book)


}

router.get("/all/authors", getAllAuthors);
router.get("/author/:id", validateAuthorId, getAuthorById)
router.get("/author", getAuthorBook)

export default router 
