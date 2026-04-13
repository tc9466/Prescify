import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/* ---- Left Section ---- */}
            <div>
                <img className='mb-5 w-40' src={assets.LOGOPRESCIFY} alt="" />
                <p className='w-full md:-2/3 text-gray-600 leading-6'> Lorem ipsum consectetur adipisicing elit. Excepturi repellat laboriosam repudiandae quibusdam in laudantium esse quas ad voluptatibus, rerum cum autem ipsum! Aliquid, deleniti voluptatum. Ea, non labore. Culpa?</p>
            </div>
             {/* ---- Center Section ---- */}
            <div >
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Contact us</li>
                    <li>Privacy Policy</li>

                </ul>
            </div>
             {/* ---- Right Section ---- */}
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Email: tc9466@gmail.com</li>
                    <li>Phone:9466606534</li>
                </ul>
            </div>
        </div>
        <div>
            {/*----- Copyright Text -----*/}
            <p className='py-5 text-sm text-center'>&copy; 2026 PRESCIFY . All rights reserved.</p>
        </div>
      
    </div>
  )
}

export default Footer
