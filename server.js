const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./config/db');

// Express server
const app = express();

// Helmet helps you secure your Express apps by setting various HTTP headers
// https://github.com/helmetjs/helmet
app.use(helmet());

// Enable CORS with various options
// https://github.com/expressjs/cors
app.use(cors());

// Request logger
// https://github.com/expressjs/morgan

app.use(morgan('dev'));

// Parse incoming request bodies
// https://github.com/expressjs/body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect database

connectDB();

// Routes to check endpoints

app.use('/api/users', require('./controller/user.controller'));

// Server port
const PORT = process.env.PORT || 5000;

// Server listning on port
app.listen(PORT, () => console.log(`Server Started On Port ${PORT}`));
