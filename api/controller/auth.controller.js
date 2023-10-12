import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = bcryptjs.hashSync(password, 10)
        const newUser = new User({ username, email, password: hashedPassword })
        await newUser.save()
        res.status(201).json("User created successfully")
    } catch (error) {
        next(error)
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return res.status(404).json("User not found");
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return res.status(401).json("Invalid password or email");
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...userInfo } = validUser._doc
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(userInfo);
    } catch (error) {
        next(error);
    }
}