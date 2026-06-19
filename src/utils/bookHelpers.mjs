export function getBookIndex(req, res, books) {

    const id = Number(req.params.id);

    const index = books.findIndex(
        item => item.id === id
    );

    if (index === -1) {

        res.status(404).send({
            message: "Book not found"
        });

        return null;
    }

    return index;
}