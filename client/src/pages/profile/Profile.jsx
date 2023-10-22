import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../../firebase"
import axios from "axios"
import { deleteUser, updateUserSuccess } from "../../redux/user/userSlice"
import { Link } from "react-router-dom"
import Listing from "./Listing"

export default function Profile() {
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [updateError, setUpdateError] = useState(false)
  const [listings, setListings] = useState([])
  const [listingLoad, setListingLoad] = useState(false)
  const [listingError, setListingError] = useState('')
  const { currentUser } = useSelector(state => state.user)
  const [updateSucces, setUpdateSuccess] = useState(false)
  const fileRef = useRef(null)
  const listingRef = useRef()
  const dispatch = useDispatch()

  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)
    setFileUploadError(false)

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePerc(Math.round(progress))
      },
      (error) => {
        setFileUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => setFormData({ ...formData, avatar: downloadURL })).catch(err => console.log(err))
      })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleDeleteUser = async () => {
    await axios.delete(`/api/user/delete/${currentUser._id}`)
      .then(res => {
        if (res.status == 200) {
          dispatch(deleteUser())
        }
      })
      .catch(err => console.log(err))
  }

  const signOut = () => {
    axios.get("/api/auth/signout")
      .then(res => {
        if (res.status == 200) dispatch(deleteUser())
      })
      .catch(err => console.log(err))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    setUpdateError(false)
    axios.put(`/api/user/update/${currentUser._id}`, formData)
      .then(res => {
        if (res.status == 200) {
          setLoading(false)
          dispatch(updateUserSuccess(res.data))
          setUpdateSuccess(true)
        }
      }).catch(err => {
        setLoading(false)
        setUpdateError(err.response.data)
        setUpdateSuccess(false)
      })
  }

  const handleShowListings = async () => {
    setListingLoad(true)
    setListingError('')
    await axios.get(`/api/user/listings/${currentUser._id}`)
      .then(res => {
        setListings(res.data)
      })
      .catch(err => setListingError(err.response.data))
      .finally(() => setListingLoad(false))
  }

  const scrollListing = () => {
    listingRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  //firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')
  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])

  useEffect(() => {
    scrollListing()
  }, [listings])
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className="flex flex-col gap-4">
        <input onChange={e => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className="rounded-full object-cover h-24 w-24 cursor-pointer self-center mt-2" />
        <p className="text-sm self-center">
          {fileUploadError ?
            <span className="text-red-700">Error image upload (max image size 2MB)</span> : (
              (filePerc > 0 && filePerc < 100) ?
                <span className="text-slate-700">{`Uploading ${filePerc}%`}</span> :
                filePerc === 100 ?
                  <span className="text-green-700">Image successfully uploaded!</span> :
                  ""
            )
          }
        </p>
        <input type="text" placeholder="username" id="username" className="border p-3 rounded-lg" defaultValue={currentUser.username} onChange={handleChange} />
        <input type="email" placeholder="email" id="email" className="border p-3 rounded-lg" defaultValue={currentUser.email} onChange={handleChange} />
        <input type="password" placeholder="password" id="password" className="border p-3 rounded-lg" onChange={handleChange} />
        <button type="button" onClick={handleSubmit} className={`${updateError ? 'bg-red-800' : 'bg-slate-700'} text-white rounded-lg p-3 uppercase hover:opacity-95`}>{loading ? 'loading...' : updateError ? 'try again' : 'update'}</button>
        <Link className="uppercase bg-green-700 text-white text-center rounded-lg p-3 hover:opacity-95" to="/create-listing">create listing</Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-600 cursor-pointer">Delete account</span>
        <span onClick={signOut} className="text-red-600 cursor-pointer">Sign out</span>
      </div>
      {updateError && <p className="text-red-700">{updateError}</p>}
      {updateSucces && <p className="text-green-700 font-semibold mt-1">User updated successfully!</p>}
      <button onClick={handleShowListings} className='text-green-700 w-full my-4'>{listingLoad ? 'Get Listings...' : 'Show Listings'}</button>
      {listingError && <p className='text-red-700 mt-5'>{listingError}</p>}
      {listings.length > 0 && <div ref={listingRef} key={listings[0]?.id} className="flex flex-col gap-4">
        <h1 className="text-center mt-7 text-2xl font-semibold">Your listings</h1>
        {listings.map(listing => (
          <Listing listing={listing} setListings={setListings} />
        ))}
      </div>}
    </div>
  )
}
