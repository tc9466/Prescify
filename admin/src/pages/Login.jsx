import React, { useContext, useState } from 'react'
import axios from 'axios'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { toast } from 'react-toastify'

const Login = () => {
  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { setAToken, backendUrl } = useContext(AdminContext)
  const { setDToken } = useContext(DoctorContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (state === 'Admin') {
        const { data } = await axios.post(
          backendUrl + '/api/admin/login',
          { email, password }
        )

        if (data.success) {
          localStorage.setItem('aToken', data.token)
          setAToken(data.token)
          toast.success('Admin Login Successful')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(
          backendUrl + '/api/doctor/login',
          { email, password }
        )

        if (data.success) {
          localStorage.setItem('dToken', data.token)
          setDToken(data.token)
          toast.success('Doctor Login Successful')
          console.log(data.token)
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white p-8 rounded-xl shadow-lg w-[350px]"
      >
        <p className="text-2xl font-semibold text-center mb-6">
          <span className="text-primary">{state}</span> Login
        </p>

        <div className="mb-4">
          <p className="text-sm mb-1">Email</p>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md outline-none"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className="mb-6">
          <p className="text-sm mb-1">Password</p>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md outline-none"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-red-600 transition"
        >
          Login
        </button>

        {state === 'Admin' ? (
          <p className="mt-4 text-sm">
            Doctor Login?{' '}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => setState('Doctor')}
            >
              Click here
            </span>
          </p>
        ) : (
          <p className="mt-4 text-sm">
            Admin Login?{' '}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => setState('Admin')}
            >
              Click here
            </span>
          </p>
        )}
      </form>
    </div>
  )
}

export default Login