import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

  const navigate = useNavigate()

  const { token, setToken, userData } = useContext(AppContext)

  const [showMenu, setShowMenu] = useState(false)

  const logout = () =>{
    setToken(false)
    localStorage.removeItem('token')
  }


  return (

    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>

      {/* Logo */}
      <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.LOGOPRESCIFY} alt="" />

      {/* Desktop Menu */}
      <ul className='hidden md:flex items-start gap-5 font-medium'>

        <NavLink to='/'>
          <li className='py-1'>HOME</li>
        </NavLink>

        <NavLink to='/doctors'>
          <li className='py-1'>ALL DOCTORS</li>
        </NavLink>

        <NavLink to='/about'>
          <li className='py-1'>ABOUT</li>
        </NavLink>

        <NavLink to='/contact'>
          <li className='py-1'>CONTACT</li>
        </NavLink>

      </ul>

      {/* Right Side */}
      <div className='flex items-center gap-4'>

        {
          token && userData
            ? <div className='flex items-center gap-2 cursor-pointer relative group'>

              <img className='w-8 h-8 rounded-full' src={userData.image} alt="" />
              <img className='w-2.5' src={assets.dropdown_icon} alt='' />

              {/* Dropdown */}
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>

                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>

                  <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>
                    My Profile
                  </p>

                  <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>
                    My Appointments
                  </p>

                  <p onClick={logout} className='hover:text-black cursor-pointer'>
                    Logout
                  </p>

                </div>

              </div>

            </div>

            : <button
              onClick={() => navigate('/login')}
              className='bg-primary text-white px-4 py-2 rounded-full font-light hover:bg-blue-600 transition duration-300'
            >
              Create Account
            </button>
        }

        {/* Mobile Menu Icon */}
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />

      </div>


      {/* Mobile Menu */}
      {
        showMenu && (
          <div className='fixed inset-0 bg-white z-20'>

            <div className='flex items-center justify-between px-5 py-6'>

              <img src={assets.logo} className='w-36' alt="" />

              <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7' alt="" />

            </div>

            <ul className='flex flex-col items-center gap-5 mt-5 text-lg'>

              <NavLink  onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>HOME</p></NavLink>
              <NavLink  onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>ALL DOCTORS</p></NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
              <NavLink  onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>

            </ul>
 className='px-4 py-2 rounded inline-block'
          </div>
        )
      }

    </div>
  )
}

export default Navbar