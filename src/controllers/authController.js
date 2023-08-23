import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import joi from 'joi';
import { generateTokens, sendToken } from '../middleware/sendToken.js';
import httpError from 'http-errors';
import bcrypt from 'bcrypt';

export const signUp = async (req, res, next) => {
	try {
		const userValidationSchema = joi
			.object({
				name: joi.string().min(3).max(30).required(),
				email: joi.string().email(),
				password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
				password_confirm: joi.ref('password'),
				phone: joi.string(),
				address: joi.string(),
				avatar: joi.string(),
				role: joi.string().default('user'),
				list_favorite: joi.array().items(joi.string()),
			})
			.with('password', 'password_confirm');
		const validatedData = await userValidationSchema.validateAsync(req.body);
		const existingUser = await User.findOne({ email: validatedData.email });
		if (existingUser) return next(httpError(409, 'Email already exists'));
		const newUser = await User.create(validatedData);
		sendToken(newUser.id, 201, res);
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const signIn = async (req, res, next) => {
	try {
		const userValidationSchema = joi.object({
			email: joi.string().email().required(),
			password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
		});
		const validatedData = await userValidationSchema.validateAsync(req.body);
		const user = await User.findOne({ email: validatedData.email }).select('+password');
		if (!user || !bcrypt.compare(validatedData.password, user.password))
			return next(httpError(400, 'Incorrect Email or Password'));
		sendToken(user.id, 200, res);
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};
