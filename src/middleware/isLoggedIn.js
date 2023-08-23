import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../util/appError.js';
const isLoggedIn = async (req, res, next) => {
	if (req.cookies.jwt) {
		console.log(req.cookies.jwt);
		const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_ACCESS_SECRET);
		const currentUser = await User.findById(decoded.id);
		if (!currentUser) return next(new AppError('The user belonging to this does no longer exists', 401));
		req.user = currentUser;
		next();
	} else {
		next(new AppError('You are not logged in! Please log in to get access', 401));
	}
};

export default isLoggedIn;
