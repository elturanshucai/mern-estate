import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { app } from '../../firebase'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function UpdateListing() {
    const { currentUser } = useSelector(state => state.user)
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 10,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
        userRef: currentUser._id
    })
    const [imageUploadError, setImageUploadError] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [creating, setCreating] = useState(false)
    const [creatingError, setCreatingError] = useState(false)

    const { id } = useParams()
    const navigate = useNavigate()

    const getListing = () => {
        axios.get(`/api/listing/${id}`)
            .then(res => setFormData(res.data))
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getListing()
    }, [id])

    const handleImageUpload = () => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true)
            setImageUploadError(false)
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
                .then((urls) => {
                    setFormData({
                        ...formData,
                        imageUrls: formData.imageUrls.concat(urls),
                    });
                    setImageUploadError(false)
                })
                .catch((err) => {
                    setImageUploadError('Image upload failed (max 2 MB per image)')
                })
                .finally(() => {
                    setUploading(false)
                })
        } else {
            setImageUploadError('You can only upload min-1, max-6 images per listing!')
        }
    };

    const storeImage = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => { },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            )
        })
    };
    const handleRemoveImage = (index) => {
        let newUrls = formData.imageUrls.filter((item, i) => i !== index)
        setFormData({
            ...formData,
            imageUrls: newUrls
        })
    }

    const handleChange = (e) => {
        let { id, value } = e.target
        if (id === "sale" || id === "rent") {
            setFormData({
                ...formData,
                type: id
            })
        } else if (id === "parking" || id === "furnished" || id === "offer") {
            setFormData({
                ...formData,
                [id]: e.target.checked
            })
        } else {
            setFormData({
                ...formData,
                [id]: value
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.imageUrls.length < 1) {
            return setCreatingError('You must 1 image upload')
        }
        if (formData.regularPrice < formData.discountPrice) return setCreatingError('Discount price must be lower than regular price.')
        setCreating(true)
        setCreatingError(false)
        await axios.put(`/api/listing/update/${id}`, formData)
            .then(res => {
                if (res.status == 200) {
                    navigate(`/listing/${res.data._id}`)
                }
            })
            .catch(err => {
                console.log(err)
                setCreatingError('Listing create error')
            })
            .finally(() => {
                setCreating(false)
            })
    }
    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Update a Listing</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4 sm:flex-row'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input onChange={handleChange} type="text" placeholder='Name' className='border rounded-lg p-3' id='name' maxLength="62" minLength="5" required value={formData.name} />
                    <textarea onChange={handleChange} type="text" placeholder='Description' className='border rounded-lg p-3 max-h-40 h-40' id='description' required value={formData.description} />
                    <input onChange={handleChange} type="text" placeholder='Address' className='border rounded-lg p-3' id='address' required value={formData.address} />
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='sale' className='w-5' onChange={handleChange} checked={formData.type === "sale"} />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='rent' className='w-5' onChange={handleChange} checked={formData.type === "rent"} />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='parking' className='w-5' onChange={handleChange} checked={formData.parking} />
                            <span>Parking spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='furnished' className='w-5' onChange={handleChange} checked={formData.furnished} />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='offer' className='w-5' onChange={handleChange} checked={formData.offer} />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='bedrooms' min='0' max='10' required className='p-2 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.bedrooms} onWheel={(e) => e.target.blur()} />
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='bathrooms' min='0' max='10' required className='p-2 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.bathrooms} onWheel={(e) => e.target.blur()} />
                            <p>Bahts</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='regularPrice' min='10' max="1000000000" required className='p-2 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.regularPrice} onWheel={(e) => e.target.blur()} />
                            <div className='flex flex-col items-center'>
                                <p>Regular price</p>
                                {formData.type === 'rent' && <span className='text-xs'>($ / month)</span>}
                            </div>
                        </div>
                        {formData.offer && <div className='flex items-center gap-2'>
                            <input type="number" id='discountPrice' min='0' max="1000000000" required className='p-2 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.discountPrice} onWheel={(e) => e.target.blur()} />
                            <div className='flex flex-col items-center'>
                                <p>Dicounted price</p>
                                {formData.type === 'rent' && <span className='text-xs'>($ / month)</span>}
                            </div>
                        </div>}
                    </div>
                </div>
                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold'>Images:
                        <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                    </p>
                    <div className='flex gap-4'>
                        <input onChange={(e) => setFiles(e.target.files)} type="file" id="images" accept='image/*' multiple className='p-3 border border-gray-300 rounded w-full' />
                        <button onClick={handleImageUpload} type='button' className='p-3 text-green-700 uppercase border border-green-700 rounded hover:shadow-lg disabled:opacity-70' disabled={uploading}>
                            {uploading ? 'uploading...' : 'upload'}
                        </button>
                    </div>
                    <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                            <div key={url} className='flex justify-between p-3 border items-center'>
                                <img src={url} className='w-20 h-20 object-contain rounded-lg' />
                                <button className='p-3 rounded-lg uppercase text-red-600 hover:opacity-70' type='button' onClick={() => handleRemoveImage(index)}>delete</button>
                            </div>
                        ))
                    }
                    <button className='p-3 my-2 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80' type='submit' disabled={creating || uploading}>{creating ? 'updating...' : 'update listing'}</button>
                    {creatingError && <p className='text-red-700 text-sm'>{creatingError}</p>}
                </div>
            </form>
        </main>
    )
}
