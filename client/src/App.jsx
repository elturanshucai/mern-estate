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

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
        </Route>
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  )
}
