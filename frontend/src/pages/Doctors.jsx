import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Doctors = () => {
  const { speciality } = useParams()
  const navigate = useNavigate()

  const { doctors, getDoctorsData } = useContext(AppContext)
  const [filterDoc, setFilterDoc] = useState([])

  useEffect(() => {
    getDoctorsData()
  }, [])

  useEffect(() => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }, [doctors, speciality])

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>

      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <div className='flex flex-col gap-4 text-sm text-gray-600'>
          <p
            onClick={() =>
              speciality === 'General physician'
                ? navigate('/doctors')
                : navigate('/doctors/General physician')
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === 'General physician' ? 'bg-indigo-100 text-black' : ''
            }`}
          >
            General physician
          </p>

          <p
            onClick={() =>
              speciality === 'Gynecologist'
                ? navigate('/doctors')
                : navigate('/doctors/Gynecologist')
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === 'Gynecologist' ? 'bg-indigo-100 text-black' : ''
            }`}
          >
            Gynecologist
          </p>

          <p
            onClick={() =>
              speciality === 'Dermatologist'
                ? navigate('/doctors')
                : navigate('/doctors/Dermatologist')
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === 'Dermatologist' ? 'bg-indigo-100 text-black' : ''
            }`}
          >
            Dermatologist
          </p>

          <p
            onClick={() =>
              speciality === 'Pediatricians'
                ? navigate('/doctors')
                : navigate('/doctors/Pediatricians')
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === 'Pediatricians' ? 'bg-indigo-100 text-black' : ''
            }`}
          >
            Pediatricians
          </p>

          <p
            onClick={() =>
              speciality === 'Neurologist'
                ? navigate('/doctors')
                : navigate('/doctors/Neurologist')
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === 'Neurologist' ? 'bg-indigo-100 text-black' : ''
            }`}
          >
            Neurologist
          </p>

          <p
            onClick={() =>
              speciality === 'Gastroenterologist'
                ? navigate('/doctors')
                : navigate('/doctors/Gastroenterologist')
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === 'Gastroenterologist' ? 'bg-indigo-100 text-black' : ''
            }`}
          >
            Gastroenterologist
          </p>
        </div>

        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {filterDoc.map((item, index) => (
            <div
              onClick={() => {
                if (item.available !== true) return
                navigate(`/appointment/${item._id}`)
                window.scrollTo(0, 0)
              }}
              key={index}
              className={`border border-blue-200 rounded-xl overflow-hidden transition-all duration-300 ${
                item.available === true
                  ? 'cursor-pointer hover:-translate-y-2'
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
      </div>
    </div>
  )
}

export default Doctors