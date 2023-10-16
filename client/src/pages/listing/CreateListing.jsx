import React from 'react'

export default function CreateListing() {
    const handleChange = () => {

    }
    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
            <form className='flex flex-col gap-4 sm:flex-row'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input onChange={handleChange} type="text" placeholder='Name' className='border rounded-lg p-3' id='name' maxLength="62" minLength="5" required />
                    <textarea onChange={handleChange} type="text" placeholder='Description' className='border rounded-lg p-3 max-h-40' id='description' required />
                    <input onChange={handleChange} type="text" placeholder='Address' className='border rounded-lg p-3' id='address' required />
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='sale' className='w-5' />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='rent' className='w-5' />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='parking' className='w-5' />
                            <span>Parking spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='furnished' className='w-5' />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='offer' className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='bedrooms' min='0' max='10' required className='p-2 border border-gray-300 rounded-lg' />
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='bathrooms' min='0' max='10' required className='p-2 border border-gray-300 rounded-lg' />
                            <p>Bahts</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='regularPrice' min='0' max="10" required className='p-2 border border-gray-300 rounded-lg' />
                            <div className='flex flex-col items-center'>
                                <p>Regular price</p>
                                <span className='text-xs'>($ / month)</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='discountPrice' min='0' max="10" required className='p-2 border border-gray-300 rounded-lg' />
                            <div className='flex flex-col items-center'>
                                <p>Dicounted price</p>
                                <span className='text-xs'>($ / month)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold'>Images:
                        <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                    </p>
                    <div className='flex gap-4'>
                        <input type="file" id="images" accept='image/*' multiple className='p-3 border border-gray-300 rounded w-full' />
                        <button type='button' className='p-3 text-green-700 uppercase border border-green-700 rounded hover:shadow-lg disabled:opacity-80'>upload</button>
                    </div>
                    <button className='p-3 my-2 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>create listing</button>
                </div>
            </form>
        </main>
    )
}
