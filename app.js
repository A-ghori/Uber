const express = require('express');
const cors = require('cors');
const app = express();
const connectToDb = require ('./db/db');
const userRoutes = require("./routes/user.route")

connectToDb();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/', (req, res) => {
    res.send("Hello World  hi!");
});

app.use('/users', userRoutes);

module.exports = app;
