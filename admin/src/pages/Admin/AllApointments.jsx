import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

const AllAppointments = () => {
  const {
    aToken,
    appointments,
    getAllAppointments,
    cancelAppointment,
    currency
  } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  const calculateAge = (dob) => {
    if (!dob) return 'N/A'

    const birthDate = new Date(dob)
    const today = new Date()

    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--
    }

    return age
  }

  const slotDateFormat = (slotDate) => {
    if (!slotDate) return 'N/A'

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]

    const [day, month, year] = slotDate.split('_')
    return `${day} ${months[Number(month) - 1]} ${year}`
  }

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm min-h-[60vh] max-h-[80vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_2.5fr_1fr_2fr_2.5fr_1fr_1fr] py-3 px-6 border-b font-medium text-gray-700'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {Array.isArray(appointments) && appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div
              key={item._id || index}
              className='flex flex-wrap justify-between max-sm:gap-4 sm:grid sm:grid-cols-[0.5fr_2.5fr_1fr_2fr_2.5fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
            >
              <p className='max-sm:hidden'>{index + 1}</p>

              <div className='flex items-center gap-3'>
                <img
                  className='w-8 h-8 rounded-full object-cover'
                  src={item?.userData?.image || assets.profile_pic}
                  alt=''
                />
                <p>{item?.userData?.name || 'N/A'}</p>
              </div>

              <p className='max-sm:hidden'>
                {calculateAge(item?.userData?.dob)}
              </p>

              <p>
                {slotDateFormat(item?.slotDate)}
                {item?.slotTime ? `, ${item.slotTime}` : ''}
              </p>

              <div className='flex items-center gap-3'>
                <img
                  className='w-8 h-8 rounded-full object-cover bg-gray-200'
                  src={item?.docData?.image || item?.docData?.Image || assets.profile_pic}
                  alt=''
                />
                <p>{item?.docData?.name || 'N/A'}</p>
              </div>

              <p>
                {currency}{item?.amount || 0}
              </p>

              <div className='flex items-center'>
                {item?.cancelled ? (
                  <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                ) : (
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className='w-10 cursor-pointer'
                    src={assets.cancel_icon}
                    alt='cancel'
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <p className='p-6 text-gray-500'>No appointments found</p>
        )}
      </div>
    </div>
  )
}

export default AllAppointments