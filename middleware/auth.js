const jwt = require('jsonwebtoken');
const config = require('config');
const secret = config.get('jwtSecret');

module.exports = function(req, res, next) {
	// Get token from the header
	const token = req.header('authorization');

	// Check if no token
	if (!token) {
		return res.status(401).json({ msg: 'No token, authorization denied' });
	}
	// verify token
	try {
		const decoded = jwt.verify(token, secret);
		req.user = decoded.user;
		next();
	} catch (err) {
		return res.status(401).json({ msg: 'Token is no valid' });
	}
};
