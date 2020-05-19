const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: [ true, 'Name is required' ]
	},
	phoneNumber: {
		type: String,
		unique: true,
		required: [ true, 'Phone number is required' ]
	},
	email: {
		type: String,
		trim: true,
		lowercase: true,
		unique: true,
		required: [ true, 'Email is required' ]
	},
	password: {
		type: String,
		required: [ true, 'Password is required' ]
	},
	role: {
		type: String,
		enum: [ 'user', 'admin' ],
		default: 'user'
	},
	isChild: {
		type: Boolean,
		default: false
	},
	member: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	c: {
		type: Boolean,
		default: false
	},
	r: {
		type: Boolean,
		default: false
	},
	d: {
		type: Boolean,
		default: false
	},
	u: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: new Date()
	}
});

module.exports = User = mongoose.model('user', userSchema);
