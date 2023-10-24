import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loader from '../../components/Loader'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
} from 'react-icons/fa';

export default function Listing() {
    SwiperCore.use([Navigation])
    const [listing, setListing] = useState({})
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const { id } = useParams()

    const getListing = () => {
        setLoading(true)
        axios.get(`/api/listing/${id}`)
            .then(res => setListing(res.data))
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        getListing()
    }, [id])
    return (
        <main>
            {loading && <Loader />}
            {!loading && <div>
                <Swiper navigation>
                    {listing?.imageUrls?.map((url, index) => (
                        <SwiperSlide key={index}>
                            <div className='h-[500px]' style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className='fixed top-[13%] right-[7%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer sm:right-[3%]'>
                    <FaShare
                        className='text-slate-500'
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setCopied(true);
                            setTimeout(() => {
                                setCopied(false);
                            }, 2000);
                        }}
                    />
                </div>
                {copied && (
                    <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                        Link copied!
                    </p>
                )}
                <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                    <p className='text-2xl font-semibold'>
                        {listing.name} - ${' '}
                        {listing.offer
                            ? listing.discountPrice?.toLocaleString('en-US')
                            : listing.regularPrice?.toLocaleString('en-US')}
                        {listing.type === 'rent' && ' / month'}
                    </p>
                    <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
                        <FaMapMarkerAlt className='text-green-700' />
                        {listing.address}
                    </p>
                    <div className='flex gap-4'>
                        <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                        </p>
                        {listing.offer && (
                            <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                ${+listing.regularPrice - +listing.discountPrice} OFF
                            </p>
                        )}
                    </div>
                    <p className='text-slate-700'>
                        <span className='font-semibold text-black'>Description-{' '}</span>
                        {listing.description}
                    </p>
                    <ul className='flex flex-wrap text-green-900 font-semibold text-sm gap-4 items-center sm:gap-6'>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaBed />
                            {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaBath />
                            {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaParking />
                            {listing.parking ? 'Parking':'No Parking'}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaChair />
                            {listing.furnished ? 'Furnished':'Not Furnished'}
                        </li>
                    </ul>
                </div>
            </div>}
        </main>
    )
}
