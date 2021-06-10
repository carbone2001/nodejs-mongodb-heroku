const express = require('express');
const morgan = require('morgan')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./models/db')

// Init DB
db.connect((err) => {
    if (err) {
        console.log(err);
        process.exit(1)
    }
    console.log('MonngoDB Connected');
})

// Cors config
const corsOptions = {
    origin: "*"
};

// Init express app
const app = express();

// Middleware for logged requests in console
app.use(morgan('tiny'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors(corsOptions));

// Routes
//app.use('/', require('./routes/index'))
//app.use('/user', require('./routes/user'));
app.use('/plan', require('./routes/plan'));
app.use('/area', require('./routes/area'));
app.use('/ticket', require('./routes/ticket'));
app.use('/cliente', require('./routes/cliente'));
app.use('/sucursal', require('./routes/sucursal'));
app.use('/empleado', require('./routes/empleado'));

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`App up on port ${port}..`))
