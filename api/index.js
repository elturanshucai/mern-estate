import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js"
import cors from "cors"
import cookieParser from "cookie-parser";

dotenv.config()

mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to Mongo DB")
}).catch(() => {
    console.log("Mongo DB connection ERROR !")
})

const app = express();

app.use(cors())
app.use(express.json());
app.use(cookieParser())

app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

app.listen(8000, () => {
    console.log("Server is running on port 8000")
})