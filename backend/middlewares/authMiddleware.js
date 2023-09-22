const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler( async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            //decode token id

            const decoded = jwt.verify( token, process.env.JWT_SECRET);

            console.log(decoded);

            const user = await User.findById(decoded.id).select("-password");
            if(!user) {throw new Error("User not found")};
            req.user = user;
            // console.log(req.user);
            next()
        }catch(error) {
            res.status(401);
            throw new Error("Not authorized, no token");
        }
    }

    if(!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
})

module.exports = { protect };