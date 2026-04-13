import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)

  const formatDate = (slotDate) => {
    if (!slotDate) return ''

    const dateArray = slotDate.split('_')
    const day = dateArray[0]
    const month = Number(dateArray[1]) - 1
    const year = dateArray[2]

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    return `${day} ${monthNames[month]} ${year}`
  }

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  if (!dashData) {
    return <div className='m-5'>Loading...</div>
  }

  return (
    <div className='m-5 w-full'>
      <div className='flex flex-wrap gap-4'>
        <div className='flex items-center gap-3 bg-white p-4 min-w-52 rounded border border-gray-100'>
          <img className='w-14' src={assets.doctor_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.doctors || 0}</p>
            <p className='text-gray-400'>Doctors</p>
          </div>
        </div>

        <div className='flex items-center gap-3 bg-white p-4 min-w-52 rounded border border-gray-100'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments || 0}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-3 bg-white p-4 min-w-52 rounded border border-gray-100'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients || 0}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>

      <div className='bg-white mt-10 rounded border'>
        <div className='flex items-center gap-2.5 px-4 py-4 border-b'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Appointments</p>
        </div>

        <div className='pt-4'>
          {dashData.latestAppointments?.length > 0 ? (
            dashData.latestAppointments.map((item, index) => (
              <div
                className='flex items-center px-6 py-3 gap-3 hover:bg-gray-50'
                key={index}
              >
                <img
                  className='rounded-full w-10 h-10 object-cover'
                  src={item?.docData?.image || item?.docData?.Image || ''}
                  alt={item?.docData?.name || 'Doctor'}
                />

                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>
                    {item?.docData?.name || 'Doctor Name'}
                  </p>
                  <p className='text-gray-500'>
                    Booking on {formatDate(item?.slotDate)}
                  </p>
                </div>

                {item?.cancelled ? (
                  <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                ) : item?.isCompleted ? (
                  <p className='text-green-500 text-xs font-medium'>Completed</p>
                ) : (
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className='w-10 cursor-pointer'
                    src={assets.cancel_icon}
                    alt=""
                  />
                )}
              </div>
            ))
          ) : (
            <p className='text-gray-500 px-6 py-4'>No appointments found</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard