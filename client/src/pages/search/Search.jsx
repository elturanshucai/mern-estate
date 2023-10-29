import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../../components/Loader'

export default function Search() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'createdAt',
        order: 'desc'
    })
    const [listings, setListings] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermUrl = urlParams.get('searchTerm')
        const typeUrl = urlParams.get('type')
        const parkingUrl = urlParams.get('parking')
        const furnishedUrl = urlParams.get('furnished')
        const offerUrl = urlParams.get('offer')
        const sortUrl = urlParams.get('sort')
        const orderUrl = urlParams.get('order')
        if (searchTermUrl || typeUrl || parkingUrl || furnishedUrl || offerUrl || sortUrl || orderUrl) {
            setSidebarData({
                searchTerm: searchTermUrl || '',
                type: typeUrl || 'all',
                parking: parkingUrl === 'true' ? true : false,
                furnished: furnishedUrl === 'true' ? true : false,
                offer: offerUrl === 'true' ? true : false,
                sort: sortUrl || 'createdAt',
                order: orderUrl || 'desc'
            })
        }
        const getSearchingData = async () => {
            setLoading(true)
            const searchQuery = urlParams.toString()
            axios.get(`/api/listing/search?${searchQuery}`)
                .then(res => setListings(res.data))
                .catch(err => console.log(err))
                .finally(() => setLoading(false))
        }
        getSearchingData()
    }, [location.search])

    const handleChange = (e) => {
        let { id, value } = e.target
        if (id === 'all' || id === 'rent' || id === 'sale') {
            setSidebarData({
                ...sidebarData,
                type: id
            })
        } else if (id === 'searchTerm') {
            setSidebarData({
                ...sidebarData,
                searchTerm: value
            })
        } else if (id === 'offer' || id === 'parking' || id === 'furnished') {
            setSidebarData({
                ...sidebarData,
                [id]: e.target.checked || e.target.checked === 'true' ? true : false
            })
        } else if (id === 'sort_order') {
            const sort = value.split('_')[0] || 'createdAt'
            const order = value.split('_')[1] || 'desc'
            setSidebarData({
                ...sidebarData, sort, order
            })
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams()
        urlParams.set('searchTerm', sidebarData.searchTerm)
        urlParams.set('type', sidebarData.type)
        urlParams.set('parking', sidebarData.parking)
        urlParams.set('furnished', sidebarData.furnished)
        urlParams.set('offer', sidebarData.offer)
        urlParams.set('sort', sidebarData.sort)
        urlParams.set('order', sidebarData.order)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }
    return (
        <div className='flex flex-col md:flex-row'>
            <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                    <div className="flex items-center gap-2">
                        <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                        <input
                            type="text"
                            id='searchTerm'
                            placeholder='Search...'
                            className='border rounded-lg p-3 w-full'
                            onChange={handleChange}
                            value={sidebarData.searchTerm}
                        />
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>Type:</label>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="all"
                                className='w-5'
                                onChange={handleChange}
                                checked={sidebarData.type === 'all'}
                            />
                            <label htmlFor='all'>Rent & Sale</label>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="rent"
                                className='w-5'
                                onChange={handleChange}
                                checked={sidebarData.type === 'rent'}
                            />
                            <label htmlFor='rent'>Rent</label>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="sale"
                                className='w-5'
                                onChange={handleChange}
                                checked={sidebarData.type === 'sale'}
                            />
                            <label htmlFor='sale'>Sale</label>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="offer"
                                className='w-5'
                                onChange={handleChange}
                                checked={sidebarData.offer}
                            />
                            <label htmlFor='offer'>Offer</label>
                        </div>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>Amenities:</label>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="parking"
                                className='w-5'
                                onChange={handleChange}
                                checked={sidebarData.parking}
                            />
                            <label htmlFor='parking'>Parking</label>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="furnished"
                                className='w-5'
                                onChange={handleChange}
                                checked={sidebarData.furnished}
                            />
                            <label htmlFor='furnished'>Furnished</label>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className='font-semibold'>Sort:</label>
                        <select
                            id="sort_order"
                            className='border rounded-lg p-3'
                            onChange={handleChange}
                            value={`${sidebarData.sort}_${sidebarData.order}`}
                        >
                            <option value="regularPrice_desc">Price high to low</option>
                            <option value="regularPrice_asc">Price low to high</option>
                            <option value="createdAt_desc">Latest</option>
                            <option value="createdAt_asc">Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 text-white rounded-lg p-3 hover:opacity-90 uppercase'>Search</button>
                </form>
            </div>
            <div className="w-full">
                <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
                {loading ? <Loader /> : null}
            </div>
        </div>
    )
}
