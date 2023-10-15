import Listing from "../models/listing.model.js"

export const createListing = async (req, res) => {
    try {
        const listing = await Listing.create(req.body)
        return res.status(201).json(listing)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}