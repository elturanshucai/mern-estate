import React from 'react'
import { Link } from 'react-router-dom'
import ListingCard from '../../components/ListingCard'

export default function SaleListings({ listings }) {
    return (
        <div className="">
            <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent sales</h2>
                <Link className='text-sm text-blue-800 hover:underline' to='/search?type=sale'>
                    Show more sales
                </Link>
            </div>
            <div className="flex flex-wrap gap-4">
                {listings.map(listing => (
                    <ListingCard listing={listing} key={listing._id} />
                ))}
            </div>
        </div>
    )
}
