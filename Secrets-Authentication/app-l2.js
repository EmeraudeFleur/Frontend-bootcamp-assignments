//Caesar cipher is one of the earlist ways of encrypting messages,简单的移位

//mongoose encryption and environment variables-dotenv to keep secret or keys safe
//1. npm i mongoose-encryption


        /////////// environment variables///////
        //npm i dotenv
        //add .env file to root directory
        //require require('dotenv').config() as early as possible.
        //put important variables in .env in form of DB_HOST=localhost
        // const secret = 'Thisisourlittlesecrets.'; delete
        //use value by process.env.NAME in plugin

/////////put .env in .gitignore file/////////////

require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

//2. require
const encrypt = require('mongoose-encryption');


app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//3. change to offical mongoose Schema if not written this way
userSchema =new mongoose.Schema ({
  email: String,
  password: String
});

//4. add secret string, it's like a key for this encryption
// const secret ='Thisisourlittlesecrets';
//encrypt, before model, mongoose plugin to increase power
//schema plugin, choose to encrypt all data or specific field
//userSchema.plugin(encrypt, {secret: secret}); encrypt all database, more specific fields add in [] with comma
//mongoose-encryption encrypt when save(), decrypt when find(); so don't have to do anything below.

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:['password']});

const User = new mongoose.model('User',userSchema);

app.get('/',function(req,res){
  res.render('home');
});

app.get('/login',function(req,res){
  res.render('login');
});

app.get('/register',function(req,res){
  res.render('register');
});

app.post('/register',function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if(err){
      console.log(err);
    } else {
      res.render('secrets');
    }
  });
});

app.post('/login',function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username},function(err, foundUser){
    if (!err) {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render('secrets');
        } else {
          res.send('password is not correct, try again');
        }
      }
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
