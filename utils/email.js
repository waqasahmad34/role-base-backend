const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const config = require('config');
const apiKey = config.get('SENDGRID_API_KEY');
sgMail.setApiKey(apiKey);

module.exports.sendRegistrationEmail = function(email, link) {
	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: 'myguardiansixtesting@gmail.com', // generated ethereal user
			pass: 'myguardiansix6' // generated ethereal password
		}
	});

	// setup email data with unicode symbols
	let mailOptions = {
		from: 'myguardiansixtesting@gmail.com', // sender address
		to: email, // list of receivers
		subject: 'Registration Link', // Subject line
		//text: 'Hello world?', // plain text body
		html: `Hi!<br> Here is Your Registration Link, Please Click: <strong><a href='${link}'>Here</a></strong> Which is only valid for 1 hour`
		// html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
		console.log('Message sent: %s', info.messageId);
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
	});
};

// module.exports.sendRegistrationEmail = function(email, link) {
// 	const msg = {
// 		to: email,
// 		from: 'myguardiansixtesting@gmail.com',
// 		subject: 'Registration Link',
// 		// text: 'and easy to do anywhere, even with Node.js',
// 		html: `Hi!<br> Here is Your Registration Link, Please Click: <strong><a href='${link}'>Here</a></strong> Which is only valid for 1 hour`
// 	};
// 	sgMail.send(msg);
// };
