import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import Home from './pages/home/Home'
import About from './pages/about/About'
import SignIn from './pages/sign-in/SignIn'
import Profile from './pages/profile/Profile'
import SignUp from './pages/sign-up/SignUp'
import Header from './components/Header'
import PrivateRoute from './components/Privateroute'
import CreateListing from './pages/listing/CreateListing'
import UpdateListing from './pages/listing/UpdateListing'
import Listing from './pages/listing/Listing'
import Search from './pages/search/Search'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/search' element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/update-listing/:id' element={<UpdateListing />} />
        </Route>
        <Route path='/listing/:id' element={<Listing />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  )
}
