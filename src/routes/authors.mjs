import express from "express"
import { books } from "../utils/constants.mjs"
import { authors } from "../utils/constants.mjs"
import { validateBookId } from "../validators/bookValidator.mjs";
import { handleValidation } from "../middleware/handleValidation.mjs";

const router = express.Router();

const getAllAuthors = async function (req, res) {

    let { filter, value } = req.query;

    if (filter && value) {

        let result = books.filter(
            item => item.title.includes(value)
        );

        return res.status(200).send(result);
    }

    let result = books.map((item) => {
        const author = authors.find((author) => author.id == item.id)
        return (
            {
                ...item,
                author
            }
        )
    })
    res.status(200).send(result);
}

const getAuthorBook = (req, res) => {
    const { filter, value } = req.query

    const author = authors.filter((author) => (
        author[filter].includes(value)
    ))

    const result = books.filter((book) => (
        author.find((author) => author.id == book.id)
    ))

    const final = result.map((item) => {
        let temp = author.find((data) => data.id == item.id)
        return (
            {
                ...item,
                author: temp
            }
        )
    })
    res.status(200).send(final)
}

router.get("/all/authors", getAllAuthors);
router.get("/authors", getAuthorBook)

export default router 
