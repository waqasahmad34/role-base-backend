const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/user');
const auth = require('../middleware/auth');
const secret = config.get('jwtSecret');

//testRoute

router.get('/', (req, res, next) => {
	return res.status(200).json({ msg: 'Hello NodeJS App' });
});

//  register

router.post('/register', async (req, res, next) => {
	const { name, email, password, phoneNumber } = req.body;
	console.log('body: --', name, email, password, phoneNumber);
	try {
		// See if user exist
		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ msg: 'User Already Exists' });
		}
		user = new User({
			name: name,
			email: email,
			password: password,
			phoneNumber: phoneNumber,
			c: true,
			r: true,
			u: true,
			d: true
		});
		// Encrypt password
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);
		await user.save();
		// Return jsonwebtoken

		const payload = {
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				create: user.c,
				read: user.r,
				update: user.u,
				del: user.d
			}
		};
		jwt.sign(payload, secret, { expiresIn: '365d' }, (err, token) => {
			if (err) throw err;
			return res.status(200).json({
				token: token,
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				create: user.c,
				read: user.r,
				update: user.u,
				del: user.d
			});
		});
	} catch (err) {
		return res.status(500).send('Server error');
	}
});

//login
router.post('/login', async (req, res, next) => {
	const { email, password } = req.body;

	try {
		// See if user exist
		let user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ msg: 'Invalid Credentials' });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ msg: 'Invalid Credentials' });
		}

		// Return jsonwebtoken
		const payload = {
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				create: user.c,
				read: user.r,
				update: user.u,
				del: user.d
			}
		};
		jwt.sign(payload, secret, { expiresIn: '365d' }, (err, token) => {
			if (err) throw err;
			return res.status(200).json({
				token: token,
				name: user.name,
				id: user.id,
				email: user.email,
				role: user.role,
				create: user.c,
				read: user.r,
				update: user.u,
				del: user.d
			});
		});
	} catch (error) {
		return res.status(500).send('Server error');
	}
});

//addMember
router.post('/addMember', auth, async (req, res, next) => {
	const { name, email, password, phoneNumber, c, u, r, d } = req.body;
	try {
		// See if user exist
		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ msg: 'User Already Exists' });
		}

		user = new User({
			name: name,
			email: email,
			password: password,
			phoneNumber: phoneNumber,
			member: req.user.id,
			isChild: true,
			c: c,
			r: r,
			u: u,
			d: d
		});
		// Encrypt password
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);
		await user.save();
		// Return jsonwebtoken

		const payload = {
			user: {
				id: user.id,
				email: user.email,
				role: user.role,
				create: user.c,
				read: user.r,
				update: user.u,
				delete: user.d
			}
		};
		jwt.sign(payload, secret, { expiresIn: '365d' }, (err, token) => {
			if (err) throw err;
			return res.status(200).json({
				token: token,
				id: user.id,
				email: user.email,
				role: user.role,
				create: user.c,
				read: user.r,
				update: user.u,
				del: user.d
			});
		});
	} catch (err) {
		return res.status(500).send('Server error');
	}
});

//read

router.get('/read', auth, async (req, res, next) => {
	try {
		const user = await User.findOne({ _id: req.user.id });
		if (!user) {
			return res.status(404).json({ msg: 'User not Found!' });
		}

		if (user.r) {
			const users = await User.find({ member: req.user.id });
			if (!users) {
				return res.status(404).json({ msg: 'User not Found!' });
			}
			return res.status(200).json({ users: users });
		}

		return res.status(200).json({ msg: 'You do not have permission to read' });
	} catch (err) {
		return res.status(500).send('Server error');
	}
});

//delete

router.post('/delete', auth, async (req, res, next) => {
	const { userId } = req.body;
	try {
		const user = await User.findOne({ _id: req.user.id });
		if (!user) {
			return res.status(404).json({ msg: 'User not Found!' });
		}

		if (user.d) {
			const removeUser = await User.findByIdAndRemove({ _id: userId });
			if (!removeUser) {
				return res.status(404).json({ msg: 'User not Found!' });
			}
			const users = await User.find({ member: req.user.id });
			return res.status(200).json({ users: users });
		}

		return res.status(401).json({ msg: 'You do not have permission to delete' });
	} catch (err) {
		return res.status(500).send('Server error');
	}
});

//updateCreatePermision

router.post('/createPermission', auth, async (req, res, next) => {
	const { userId, c } = req.body;
	try {
		const user = await User.findOne({ $and: [ { _id: userId }, { member: req.user.id } ] });
		if (!user) {
			return res.status(404).json({ msg: 'User not Found!' });
		}

		const updatePermision = await User.findOneAndUpdate({ _id: user._id }, { $set: { c: c } }, { new: true });

		const users = await User.find({ member: req.user.id });
		return res.status(200).json({ users: users });
	} catch (err) {
		return res.status(500).send('Server error');
	}
});

//updateReadPermision

router.post('/readPermission', auth, async (req, res, next) => {
	const { userId, r } = req.body;
	try {
		const user = await User.findOne({ $and: [ { _id: userId }, { member: req.user.id } ] });
		if (!user) {
			return res.status(404).json({ msg: 'User not Found!' });
		}

		const updatePermision = await User.findOneAndUpdate({ _id: user._id }, { $set: { r: r } }, { new: true });

		const users = await User.find({ member: req.user.id });
		return res.status(200).json({ users: users });
	} catch (err) {
		return res.status(500).send('Server error');
	}
});

//updateDeletePermision

router.post('/deletePermission', auth, async (req, res, next) => {
	const { userId, d } = req.body;
	try {
		const user = await User.findOne({ $and: [ { _id: userId }, { member: req.user.id } ] });
		if (!user) {
			return res.status(404).json({ msg: 'User not Found!' });
		}

		const updatePermision = await User.findOneAndUpdate({ _id: user._id }, { $set: { d: d } }, { new: true });

		const users = await User.find({ member: req.user.id });
		return res.status(200).json({ users: users });
	} catch (err) {
		return res.status(500).send('Server error');
	}
});
module.exports = router;
