import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { signInStart, signInSuccess, signInFailure } from '../../redux/user/userSlice'
import OAuth from '../../components/OAuth'

export default function SignIn() {
  const [postData, setPostData] = useState({})
  const [error, setError] = useState(null)
  const { loading } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.id]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(signInStart())
    axios.post(`/api/auth/signin`, postData)
      .then(res => {
        dispatch(signInSuccess(res.data))
        setError(null)
        if (res.status == 200) {
          navigate("/")
        }
      })
      .catch(err => {
        dispatch(signInFailure(err?.response?.data?.message || err?.response?.data))
        setError(err?.response?.data?.message || err?.response?.data)
      })
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4 '>
        <input type="email" placeholder='email' className='border p-3 rounded-lg'
          id='email' onChange={handleChange} />
        <input type="password" placeholder='password' className='border p-3 rounded-lg'
          id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80' onClick={handleSubmit}>{loading ? 'loading...' : 'Sign in'}</button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Create account?</p>
        <Link to="/sign-up">
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}
