import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

// API to change doctor availability from admin panel
const changeAvailability = async(req, res) => {
    try {
        const { docId } = req.body;

        const docData = await doctorModel.findById(docId);

        if (!docData) {
            return res.json({
                success: false,
                message: "Doctor not found",
            });
        }

        await doctorModel.findByIdAndUpdate(docId, {
            available: !docData.available,
        });

        return res.json({
            success: true,
            message: "Availability Changed",
        });
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// API to get doctor list for frontend
const doctorList = async(req, res) => {
    try {
        const doctors = await doctorModel.find({}).select("-password -email");

        return res.json({
            success: true,
            doctors,
        });
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// API for doctor login
const loginDoctor = async(req, res) => {
    try {
        const { email, password } = req.body;

        const doctor = await doctorModel.findOne({ email });

        if (!doctor) {
            return res.json({
                success: false,
                message: "Invalid Credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid Credentials",
            });
        }

        const token = jwt.sign({ id: doctor._id },
            process.env.JWT_SECRET, { expiresIn: "1d" }
        );

        return res.json({
            success: true,
            message: "Doctor login successful",
            token,
        });
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async(req, res) => {
    try {
        const { docId } = req;

        const appointments = await appointmentModel.find({ docId });

        return res.json({
            success: true,
            appointments,
        });
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// API to mark appointment complete for doctor panel
const appointmentComplete = async(req, res) => {
    try {
        const docId = req.docId;
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({
                success: false,
                message: "Appointment not found",
            });
        }

        if (appointmentData.docId.toString() !== docId) {
            return res.json({
                success: false,
                message: "Unauthorized action",
            });
        }

        if (appointmentData.cancelled) {
            return res.json({
                success: false,
                message: "Cancelled appointment cannot be completed",
            });
        }

        if (appointmentData.isCompleted) {
            return res.json({
                success: false,
                message: "Appointment already completed",
            });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, {
            isCompleted: true,
        });

        return res.json({
            success: true,
            message: "Appointment Completed",
        });
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// API to cancel appointment for doctor panel
const appointmentCancel = async(req, res) => {
    try {
        const docId = req.docId;
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({
                success: false,
                message: "Appointment not found",
            });
        }

        if (appointmentData.docId.toString() !== docId) {
            return res.json({
                success: false,
                message: "Unauthorized action",
            });
        }

        if (appointmentData.isCompleted) {
            return res.json({
                success: false,
                message: "Completed appointment cannot be cancelled",
            });
        }

        if (appointmentData.cancelled) {
            return res.json({
                success: false,
                message: "Appointment already cancelled",
            });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, {
            cancelled: true,
        });

        return res.json({
            success: true,
            message: "Appointment Cancelled",
        });
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// API to get dashboard data for doctor panel
const doctorDashboard = async(req, res) => {
    try {
        const docId = req.docId;

        const appointments = await appointmentModel.find({ docId });

        let earnings = 0;
        appointments.forEach((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount;
            }
        });

        let patients = [];
        appointments.forEach((item) => {
            if (!patients.includes(item.userId.toString())) {
                patients.push(item.userId.toString());
            }
        });

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: [...appointments].reverse().slice(0, 5),
        };

        return res.json({
            success: true,
            dashData,
        });
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// API to get doctor profile for doctor panel
const doctorProfile = async(req, res) => {
    try {
        const docId = req.docId;

        const profileData = await doctorModel.findById(docId).select("-password");

        if (!profileData) {
            return res.json({
                success: false,
                message: "Doctor not found",
            });
        }

        return res.json({
            success: true,
            profileData,
        });
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// API to update doctor profile data from doctor panel
const updateDoctorProfile = async(req, res) => {
    try {
        const docId = req.docId;
        const { fees, address, available } = req.body;

        await doctorModel.findByIdAndUpdate(docId, {
            fees,
            address,
            available,
        });

        return res.json({
            success: true,
            message: "Profile Updated",
        });
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

export {
    changeAvailability,
    doctorList,
    loginDoctor,
    appointmentsDoctor,
    appointmentComplete,
    appointmentCancel,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
};