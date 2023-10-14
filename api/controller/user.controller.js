import bcryptjs from "bcryptjs"
import User from "../models/user.model.js"

export const updateUser = async (req, res) => {
    try {
        if (req.user.id !== req.params.id) return res.status(403).json("You can only update own account")
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, { new: true })
        const { password: pass, ...updateUserInfo } = updatedUser._doc;
        res.status(200).json(updateUserInfo)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}