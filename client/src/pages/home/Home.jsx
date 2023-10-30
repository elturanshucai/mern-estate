import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import OfferListings from "./OfferListings"
import SaleListings from "./SaleListings"
import RentListings from "./RentListings"

export default function Home() {
  const [offerListings, setOfferListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  const [rentListings, setRentListings] = useState([])
  SwiperCore.use([Navigation])

  const getOfferListings = async () => {
    await axios.get(`/api/listing/search?offer=true&limit=4`)
      .then(res => {
        setOfferListings(res.data)
        if (res.status === 200) getSaleListings()
      })
      .catch(err => console.log(err))
  }
  const getSaleListings = async () => {
    await axios.get(`/api/listing/search?type=sale&limit=4`)
      .then(res => {
        setSaleListings(res.data)
        if (res.status === 200) getRentListings()
      })
      .catch(err => console.log(err))
  }
  const getRentListings = async () => {
    await axios.get(`/api/listing/search?type=rent&limit=4`)
      .then(res => setRentListings(res.data))
      .catch(err => console.log(err))
  }
  useEffect(() => {
    getOfferListings()
  }, [])
  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Eltu Estate is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link to='/search' className="text-xs sm:text-sm text-blue-800 font-bold hover:underline w-fit">
          Let's get started...
        </Link>
      </div>
      <Swiper navigation>
        {offerListings.length > 0 && offerListings.map(listing => (
          <SwiperSlide>
            <div style={{ background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: "cover" }} className="h-[500px]" key={listing._id}>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings.length > 0 && <OfferListings listings={offerListings} />}
        {saleListings.length > 0 && <SaleListings listings={saleListings} />}
        {rentListings.length > 0 && <RentListings listings={rentListings} />}
      </div>
    </div>
  )
}
