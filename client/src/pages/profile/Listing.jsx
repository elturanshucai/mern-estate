import React from 'react'
import { Link } from 'react-router-dom'

export default function ({ listing }) {
    return (
        <div key={listing._id} className='border rounded-lg p-3 flex items-center gap-4'>
            <img src={listing.imageUrls[0]} className='h-16 w-16 object-contain' />
            <Link to={`/listing/${listing._id}`} className='w-full'>
                <p className='text-slate-700 font-semibold flex-1 hover:underline truncate'>{listing.name}</p>
            </Link>
            <div className='flex flex-col gap-2'>
                <button className='text-red-600 uppercase'>Delete</button>
                <button className='text-yellow-400 uppercase'>Edit</button>
            </div>
        </div>
    )
}
