import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
const Navbar = () => {
  const navigate = useNavigate()

  const { aToken, setAToken } = useContext(AdminContext)
  const { dToken, setDToken } = useContext(DoctorContext)

  const logout = () => {
    navigate('/')
    aToken && setAToken('')
    dToken && setDToken('')
    aToken && localStorage.removeItem('aToken')
    dToken && localStorage.removeItem('dToken')
  }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <img className='w-36 sm:w-40 cursor-pointer' src={assets.ADMIN_LOGOPRESCIFY9} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500'>
          {aToken ? 'Admin' : 'Doctor'}
        </p>
      </div>

      <button
        onClick={logout}
        className='bg-primary text-white text-sm px-10 py-2 rounded-full'
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar