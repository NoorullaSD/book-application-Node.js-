import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { users } from "../utils/constants.mjs";
import express from "express";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2,
    message: {
        success: false,
        message: "Too many requests. Try again later."
    }
});

const router = express.Router();


router.get("/all/users", (req, res) => {
    res.status(200).send(users)
})

router.post("/register", async (req, res) => {
    const { email, password } = req.body

    let existUser = users.find((item) => {
        item.email == email
    })

    if (existUser) {
        return res.send({
            message: "email alredy exist"
        })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    users.push({
        id: users.length + 1,
        email: email,
        password: hashPassword
    })

    return res.status(200).send({
        message: "user created succesfully"
    })

})

router.post("/login", limiter, async (req, res) => {
    const { email, password } = req.body

    const user = users.find((item) => (
        item.email == email
    ))

    if (!user) {
        return res.status(404).send({
            message: "User not found"
        })
    }

    const isValid = await bcrypt.compare(
        password,
        user.password
    )

    if (!isValid) {
        return res.send({
            message: "user is in valid"
        })
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: email
        },
        "my-secret-key",
        {
            expiresIn: "24h"
        }
    )

    res.json({ token })


})

export default router