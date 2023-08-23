import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema({
	name: String,
	email: String,
	password: {
		type: String,
		select: false,
	},
	phone: String,
	address: String,
	avatar: String,
	role: {
		type: String,
		select: false,
	},
	list_favorite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', select: false }],
	refreshToken: String,
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = bcrypt.hashSync(this.password, 12);
});

const User = mongoose.model('User', userSchema);

export default User;
