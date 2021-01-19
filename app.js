require('dotenv').config();

// Express
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('config');
const app = express();

// Controller Imports
const user = require('./controllers/usercontroller');
const game = require('./controllers/gamecontroller');
const friend = require('./controllers/friendcontroller');

app.use(morgan('dev'));
// DB Import & Sync
const sequelize = require('./db');
sequelize.sync();
app.use(express.json());

app.use(cors());

// Middleware
// app.use(require('./middleware/headers'));

// Exposed Routes
app.use('/user', user);


// Protected Routes
app.use(require('./middleware/validate-session'));
app.use('/game', game);
app.use('/friend', friend);

const port = config.get('PORT')
app.listen(port, () => console.log(`Listening on port ${port}`));
