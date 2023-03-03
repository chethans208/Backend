const express = require('express')
const app = express()


//!require databse model
const User = require('./models/users')
const Post = require('./models/posts')
const cors = require('cors')

//!middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors()) //cross origin resources sharing(CORS) 

//!mongoose
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const dbURL = "mongodb://localhost:27017/foodie"

mongoose.connect(dbURL).then(() => {
    console.log("connected to databse");
})

app.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }, (err, userData) => {
        if (userData) {
            if (req.body.password == userData.password) {
                res.send({ message: "Login Successfull" })
            } else {
                res.send({ message: "Login Failed" })
            }
        } else {
            res.send({ message: "No account seems to be matching with your credentials" })
        }
    })
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

app.get('/signup', async (req,res)=>{
    try {
        let customers = await User.find()
        res.send(customers)
    } catch (error) {
        console.log(error);
    }
})
app.get('/foods', async (req, res) => {
    try {
        let posts = await Post.find()
        res.send(posts)
    } catch (error) {
        console.log(error);
    }
})

app.get('/foods/:id', async (req, res) => {
    const { id } = req.params
    try {
        const singlePost = await Post.findById(id)
        res.send(singlePost)
    } catch (error) {
        res.send(error)
    }
})

app.post('/add-post', async (req, res) => {
    let postData = new Post({
        author: req.body.author,
        Title: req.body.Title,
        summary: req.body.summary,
        image: req.body.image,
        location: req.body.location
    })
    try {
        await postData.save()
        res.send({ message: "Post Added Successfully" })
    } catch (error) {
        res.send({ message: "Failed to add post" })
    }
})

let port = 4000;
app.listen(port, () => {
    console.log(`listening to ${port}`);
})