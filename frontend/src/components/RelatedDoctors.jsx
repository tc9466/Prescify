import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext)
  const navigate = useNavigate()

  const [relDoc, setRelDoc] = useState([])

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      )

      setRelDoc(doctorsData)
    }
  }, [doctors, speciality, docId])

  const handleDoctorClick = (doctor) => {
    if (doctor.available !== true) return
    navigate(`/appointment/${doctor._id}`)
    window.scrollTo(0, 0)
  }

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>Related Doctors</h1>

      <p className='sm:w-1/3 text-center text-sm'>
        Simply browse through our extensive list of trusted doctors.
      </p>

      <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {relDoc.slice(0, 5).map((item, index) => (
          <div
            key={index}
            onClick={() => handleDoctorClick(item)}
            className={`border border-blue-300 rounded-xl overflow-hidden transition-all duration-300 ${
              item.available === true
                ? 'cursor-pointer hover:translate-y-[-10px]'
                : 'cursor-not-allowed opacity-90'
            }`}
          >
            <img
              className='bg-blue-50 w-full h-56 object-cover'
              src={item.image || item.Image}
              alt={item.name}
            />

            <div className='p-4'>
              <div
                className={`flex items-center gap-2 text-sm ${
                  item.available === true ? 'text-green-500' : 'text-gray-500'
                }`}
              >
                <p
                  className={`w-2 h-2 rounded-full ${
                    item.available === true ? 'bg-green-500' : 'bg-gray-500'
                  }`}
                ></p>
                <p>{item.available === true ? 'Available' : 'Not Available'}</p>
              </div>

              <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
              <p className='text-sm text-gray-600'>{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          navigate('/doctors')
          window.scrollTo(0, 0)
        }}
        className='bg-blue-500 text-white px-12 py-3 rounded-lg hover:bg-blue-600 transition-colors'
      >
        View More
      </button>
    </div>
  )
}

export default RelatedDoctors