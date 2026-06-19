import express from "express";
import passport from "passport";
import bookRoutes from "./src/routes/books.mjs";
import authors from "./src/routes/authors.mjs";
import auth from "./src/routes/auth.mjs"
import './src/config/passport.js'
import errorHandler from "./src/middleware/errorHandler.mjs";
import cors from "cors";


const app = express();

const PORT = 3000;

app.use(express.json());
app.use(passport.initialize());

app.use("/api", bookRoutes);
app.use("/api", authors)
app.use("/api", auth)

app.use(errorHandler);


app.use(cors({
    origin: "*", // For production avoid * insted of put https://myapp.com (or) http://localhost:5173 like this
    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE"
    ],
    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ]
}));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});