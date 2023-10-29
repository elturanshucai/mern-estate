import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'

export default function ({ listing, setListings }) {
    const deleteListing = (id) => {
        axios.delete(`/api/listing/delete/${id}`)
            .then(() => {
                setListings((prev) => prev.filter((listing) => listing._id !== id))
            })
            .catch(err => console.log(err))
    }
    return (
        <div key={listing._id} className='border rounded-lg p-3 flex items-center gap-4'>
            <img src={listing.imageUrls[0]} className='h-16 w-16 object-contain' />
            <Link to={`/listing/${listing._id}`} className='w-72'>
                <p className='text-slate-700 font-semibold flex-1 hover:underline truncate'>{listing.name}</p>
            </Link>
            <div className='flex flex-col gap-2'>
                <button className='text-red-600 uppercase' onClick={() => deleteListing(listing._id)}>Delete</button>
                <Link to={`/update-listing/${listing._id}`}>
                    <button className='text-yellow-400 uppercase'>Edit</button>
                </Link>
            </div>
        </div>
    )
}
