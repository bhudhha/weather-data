require('dotenv').config();
const { urlencoded } = require('express');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
require('./db/conn');
const Register = require('./models/register')
const bcrypt = require('bcryptjs')
var cookieParser = require('cookie-parser')
const auth = require('./middleware/auth');
const PORT = process.env.PORT || 3000;

const path_static = path.join(__dirname, "../public");
const temp_path = path.join(__dirname, "../temp/views")
const p_path = path.join(__dirname, "../temp/partials")
app.use(express.static(path_static))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('view engine', 'hbs');
app.set('views', temp_path);
hbs.registerPartials(p_path);



app.get('/', (req, res) => {
    // requests('http://api.openweathermap.org/data/2.5/weather?q=kichha&units=metric&appid=a817891760a86255eb0f2b2b61006bbc')
    //     .on('data', (chunk) => {
    //         const objData = JSON.parse(chunk);
    //         const arrData = [objData];
    //         console.log(arrData[0].main.temp);

    //     }) 
    res.render('index');
})
app.get('/weather', auth, (req, res) => {
    // console.log(`this is cookie ${req.cookies.jwt}`);
    res.render('weather');
})
app.get('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((ele) => {
            return ele.token !== req.token
        })
        res.clearCookie("jwt")
        console.log("clear")
        await req.user.save();
        res.render('logIn');
    } catch (e) {
        res.send(500).send(e);
    }
})
app.get('/register', (req, res) => {

    res.render('register');
})
app.post('/register', async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword
        if (password === cpassword) {
            const registerWeather = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                cityname: req.body.cityname,
                email: req.body.email,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
            })
            const token = await registerWeather.generateAuthToken();
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 1000000),
                httpOnly: true
            });
            const weatherdata = await registerWeather.save();
            res.status(201).render('weather');
        }
        else {
            res.render('register', {
                msg: `!`
            });
        }
    } catch (e) {
        res.status(400).render('register', {
            msg1: "password already exist"
        })
    }
})
app.get('/logIn', (req, res) => {
    res.render('logIn');
})
app.post('/logIn', async (req, res) => {
    try {
        const email = req.body.email;
        const pass = req.body.password;
        const userEmail = await Register.findOne({ email: email });
        const isMatch = await bcrypt.compare(pass, userEmail.password);
        const token = await userEmail.generateAuthToken();
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 1000000),
            httpOnly: true
        })
        if (isMatch) {
            res.status(201).render('index');
        } else {
            res.render('logIn', {
                msg4: "Invalid Detail"
            })
        }
    } catch (e) {
        res.status(400).render('logIn', {
            msg3: "Invalid Detail"
        })
    }
})
app.get('/forgot', (req, res) => {
    res.render('forgot');
})
app.post('/forgot', async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword
        if (password === cpassword) {
            const email = req.body.email;
            const pass = req.body.password;
            const userfind = await Register.findOne({ email: email });
            userfind.password = pass;
            await userfind.save();
            res.render('logIn');
        } else {
            res.render('forgot', {
                msg11: `confirm password not match`
            });
        }
    } catch (e) {
        res.send(e)
    }

})
app.get('*', (req, res) => {
    res.render('404error');
})

app.listen(PORT, () => {
    console.log(`server start at ${PORT}`);
})