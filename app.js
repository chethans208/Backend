const express = require('express')
const app = express()


//!require databse model
const User = require('./models/users')
const cors = require('cors')

//!middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors()) //cross origin resources  sharing 

//!mongoose
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const dbURL = "mongodb://localhost:27017/foodie"

mongoose.connect(dbURL).then(() => {
    console.log("connected to databse");
})

app.post('/signup', async (req, res) => {
    User.findOne({ email: req.body.email }, (err, userData) => {
        if (userData) {
            res.send({ message: "User already exists" })
        } else { 
            const data = new User({
                name: req.body.name,
                email: req.body.email,
                number: req.body.number,
                password: req.body.password
            })
            data.save(() => {
                if (err) {
                    res.send(err)
                }
                else {
                    res.send({ message: "user registered suucesfully" })
                }
            })
        }
    })
})


let port = 4000;
app.listen(port, () => {
    console.log(`listening to ${port}`);
})