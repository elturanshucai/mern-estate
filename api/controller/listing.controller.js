import Listing from "../models/listing.model.js"

export const createListing = async (req, res) => {
    try {
        const listing = await Listing.create(req.body)
        return res.status(201).json(listing)
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}

export const deleteListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id)
    if (!listing) return res.status(404).json('Listing not found.')
    if (req.user.id !== listing.userRef) return res.status(401).json('You can only delete your own account')
    try {
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json('Listing deleted.')
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
}