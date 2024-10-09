import React from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'

import Login from './client/login/Login'
import VerifyEmail from './client/VerifyEmail'
import ForgotPassword from './client/inputEmail/checkEmai'
import VerifyForgotpassword from './client/veriforgotpassword'
import ResetPassword from './client/resetpassword'
import Homepage from './client/homepage'
import Profile from './client/profile'
import Explore from './client/Search'
import ProfilePage from './client/profilePage'
import Message from './client/message'

const App: React.FC = () => {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path='/verify-forgot-password' element={<VerifyForgotpassword />} />
        <Route path='/checkmail' element={<ForgotPassword />} />
        <Route path='/resetpassword' element={<ResetPassword />} />
        <Route path='/home' element={<Homepage />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/Explore' element={<Explore />} />
        <Route path='/Message' element={<Message />} />
        <Route path='/profilePage' element={<ProfilePage />} />
      </Routes>
    </div>
  )
}

export default App
