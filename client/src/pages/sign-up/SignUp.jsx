import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { signInStart, signInSuccess, signInFailure } from '../../redux/user/userSlice'
import OAuth from '../../components/OAuth'

export default function SignUp() {
  const [postData, setPostData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.id]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    axios.post(`/api/auth/signup`, postData)
      .then(res => {
        if (res.status == 201) {
          dispatch(signInSuccess(res.data))
          setLoading(false)
          setError(null)
          navigate("/sign-in")
        }
      })
      .catch(err => {
        setError(err?.response?.data?.message || err?.response?.data)
        setLoading(false)
      })
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4 '>
        <input type="text" placeholder='username' className='border p-3 rounded-lg'
          id='username' onChange={handleChange} />
        <input type="email" placeholder='email' className='border p-3 rounded-lg'
          id='email' onChange={handleChange} />
        <input type="password" placeholder='password' className='border p-3 rounded-lg'
          id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80' onClick={handleSubmit}>{loading ? 'loading...' : 'Sign up'}</button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}
