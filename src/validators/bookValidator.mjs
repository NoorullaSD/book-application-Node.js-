import { param } from "express-validator";
import { books } from "../utils/constants.mjs";

export const validateBookId = [

    param("id")

        .isInt()
        .withMessage("Book id must be a number")

        .isInt({ min: 1, max: 50 })
        .withMessage("Only 50 book available")

        .custom((value, { req }) => {

            const id = Number(value);

            const index = books.findIndex(
                item => item.id === id
            );

            if (index === -1) {

                throw new Error("Book not found");

            }

            // Save for later use

            req.bookIndex = index;

            return true;
        })

];