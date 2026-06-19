import express from "express";
import { books } from "../utils/constants.mjs";
import { getBookIndex } from "../utils/bookHelpers.mjs";
import { validateBookId } from "../validators/bookValidator.mjs";
import { handleValidation } from "../middleware/handleValidation.mjs";
import passport from "passport";
import { validationResult } from "express-validator";

const router = express.Router();

const getAllBook = async function (req, res) {

    let { filter, value } = req.query;

    if (filter && value) {

        let result = books.filter(
            item => item.title.includes(value)
        );

        return res.status(200).send(result);
    }

    res.status(200).send(books);
}

router.get("/all/books", passport.authenticate("jwt", { session: false }), getAllBook);

router.get("/book/:id", validateBookId, (req, res, next) => {

    const validErrors = validationResult(req);
    let id = parseInt(req.params.id);

    try {
        let result = books.find(
            item => item.id === id
        );

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

});

router.post("/new/book", (req, res) => {

    let newBook = {
        id: books[books.length - 1].id + 1,
        ...req.body
    };

    books.push(newBook);

    res.status(201).send({
        message: "New book added"
    });
});

router.patch("/update/book/:id", validateBookId, handleValidation, (req, res) => {

    books[req.index] = {
        ...books[req.index],
        ...req.body
    };

    res.status(200).send({
        message: "Book updated successfully"
    });
});

router.put("/update/book/:id", validateBookId, handleValidation, (req, res) => {

    books[req.index] = {
        id: books[req.index].id,
        ...req.body
    };

    res.status(200).send({
        message: "Book updated successfully"
    });
});

router.delete("/delete/book/:id", validateBookId, handleValidation, (req, res) => {

    books.splice(req.index, 1);

    res.status(200).send({
        message: "Book deleted successfully"
    });
});


export default router;