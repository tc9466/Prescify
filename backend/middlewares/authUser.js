import jwt from 'jsonwebtoken'

// Middleware to verify user authentication
const authUser = async(req, res, next) => {
    try {
        const { token } = req.headers

        if (!token) {
            return res.json({
                success: false,
                message: 'Not Authorized, login again'
            })
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = token_decode.userId

        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.json({
                success: false,
                message: 'jwt expired'
            })
        }

        return res.json({
            success: false,
            message: 'Invalid token'
        })
    }
}

export default authUser