import bcryptjs from "bcryptjs"
import User from "../models/user.model.js"
import Listing from "../models/listing.model.js"

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

export const deleteUser = async (req, res) => {
    if (req.user.id !== req.params.id) return res.status(401).json("You can only delete own account!")
    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token')
        res.status(200).json("User has been deleted.")
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const getUserListings = async (req, res) => {
    if (req.user.id !== req.params.id) return res.status(401).json('You can only view your own listings!')
    try {
        const listings = await Listing.find({ userRef: req.params.id })
        res.status(200).json(listings)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json('User not found')
        const { password: pass, ...userInfo } = user._doc;
        res.status(200).json(userInfo)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}
