import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Contact({ listing }) {
    const [landlord, setLandlord] = useState({})
    const [message, setMessage] = useState('')
    const getLandlord = () => {
        axios.get(`/api/user/${listing.userRef}`)
            .then(res => setLandlord(res.data))
            .catch(err => console.log(err))
    }
    useEffect(() => {
        getLandlord()
    }, [listing.userRef])
    return (
        <>
            {landlord &&
                <div className='flex flex-col gap-2'>
                    <p>Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
                    <textarea
                        onChange={e => setMessage(e.target.value)}
                        value={message}
                        name="message"
                        id="message"
                        rows="2"
                        placeholder='Enter your message here...'
                        className='outline-slate-500 w-full border rounded-lg p-3'
                    >
                    </textarea>
                    <Link
                        to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                        className='uppercase bg-slate-700 p-3 text-white text-center rounded-lg hover:opacity-90'>
                        Send Message
                    </Link>
                </div>
            }
        </>
    )
}
