const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const connectDB = require('./app/config/dbcon')
const dotenv = require('dotenv')


dotenv.config()
connectDB()
const app = express();

app.set('view engine', 'ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.json());

app.use(express.static(path.join(__dirname,'public')))
app.use("/uploads",express.static(path.join(__dirname,'uploads')))

//router
const userApiRouter = require('./app/router/userApiRouter')
app.use('/api',userApiRouter)


const port = 4600
app.listen(port,()=>{
    console.log(`surver running at http://localhost:${port}`);
})