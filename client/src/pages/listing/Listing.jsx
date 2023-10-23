import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loader from '../../components/Loader'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'

export default function Listing() {
    SwiperCore.use([Navigation])
    const [listing, setListing] = useState({})
    const [loading, setLoading] = useState(false)
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
    console.log(listing)
    return (
        <main>
            {loading && <Loader />}
            <>
                <Swiper navigation>
                    {listing?.imageUrls?.map((url, index) => (
                        <SwiperSlide key={index}>
                            <div className='h-[500px]' style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </>
        </main>
    )
}
