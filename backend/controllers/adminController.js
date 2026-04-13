import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';

// API for Adding Doctor
const addDoctor = async(req, res) => {
    try {
        const {
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            about,
            fees,
            address,
        } = req.body;

        const imageFile = req.file;

        if (!name ||
            !email ||
            !password ||
            !speciality ||
            !degree ||
            !experience ||
            !about ||
            !fees ||
            !address ||
            !imageFile
        ) {
            return res.json({
                success: false,
                message: 'All fields are required (including doctor image)',
            });
        }

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: 'Invalid email format',
            });
        }

        if (password.length < 8) {
            return res.json({
                success: false,
                message: 'Password must be at least 8 characters',
            });
        }

        const doctorExists = await doctorModel.findOne({ email });
        if (doctorExists) {
            return res.json({
                success: false,
                message: 'Doctor already exists',
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let parsedAddress;
        try {
            parsedAddress = JSON.parse(address);
        } catch (err) {
            return res.json({
                success: false,
                message: 'Invalid address format. Must be a valid JSON string.',
            });
        }

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: 'image',
        });

        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees: Number(fees),
            address: parsedAddress,
            date: Date.now(),
            slots_booked: {},
            available: true,
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({
            success: true,
            message: 'Doctor added successfully',
        });
    } catch (error) {
        console.log('Add Doctor Error:', error);
        res.json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

// API for admin login
const loginAdmin = async(req, res) => {
    try {
        const { email, password } = req.body;

        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {
            const token = jwt.sign({ email, password },
                process.env.JWT_SECRET, { expiresIn: '180d' }
            );

            return res.json({
                success: true,
                message: 'Admin login successful',
                token,
            });
        } else {
            return res.json({
                success: false,
                message: 'Invalid email or password',
            });
        }
    } catch (error) {
        console.log('Error:', error);
        res.json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

// API to get all doctors list for admin panel
const allDoctors = async(req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password -slots_booked');

        res.json({
            success: true,
            doctors,
        });
    } catch (error) {
        console.log('Error:', error);
        res.json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

// API to get all appointments list
const appointmentsAdmin = async(req, res) => {
    try {
        const appointments = await appointmentModel.find({}).sort({ date: -1 });

        res.json({
            success: true,
            appointments,
        });
    } catch (error) {
        console.log('Error:', error);
        res.json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

// API to cancel appointment by admin
const cancelAppointmentAdmin = async(req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.json({
                success: false,
                message: 'Appointment ID is required',
            });
        }

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({
                success: false,
                message: 'Appointment not found',
            });
        }

        if (appointmentData.cancelled) {
            return res.json({
                success: false,
                message: 'Appointment already cancelled',
            });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, {
            cancelled: true,
        });

        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);

        if (doctorData) {
            let slots_booked = doctorData.slots_booked || {};

            if (slots_booked[slotDate]) {
                slots_booked[slotDate] = slots_booked[slotDate].filter(
                    (time) => time !== slotTime
                );
            }

            await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        }

        res.json({
            success: true,
            message: 'Appointment Cancelled',
        });
    } catch (error) {
        console.log('Error:', error);
        res.json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

// API to get dashboard data for admin panel
const adminDashboard = async(req, res) => {
    try {
        const doctors = await doctorModel.find({});
        const users = await userModel.find({});
        const appointments = await appointmentModel.find({}).sort({ date: -1 });

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.slice(0, 5),
        };

        res.json({
            success: true,
            dashData,
        });
    } catch (error) {
        console.log('Error:', error);
        res.json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

export {
    addDoctor,
    loginAdmin,
    allDoctors,
    appointmentsAdmin,
    cancelAppointmentAdmin,
    adminDashboard,
};