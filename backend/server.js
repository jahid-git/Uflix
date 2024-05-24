const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const userRoute = require('./routes/user.routes.js')
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require('./db/config');

app.use('/server/client/', express.static(path.join(__dirname, 'client')));
app.use('/server/', express.static(path.join(__dirname, 'frontend')));

app.use('/server/api/user', userRoute);

app.get('/server/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'));
})

app.listen();
