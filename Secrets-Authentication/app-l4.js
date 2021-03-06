//salting and hashing
//17000 bcrypt hashes/second, 远小于 md5 hashes
const express = require('express');
const app = express();
const mongoose = require('mongoose');
//1. npm i bcrypt
//2. require bcrypt
const bcrypt = require('bcrypt');
//3. salt round:
const saltRounds = 10;

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

userSchema = new mongoose.Schema({
  email: String,
  password: String
});


const User = new mongoose.model('User', userSchema);

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.get('/register', function(req, res) {
  res.render('register');
});

app.post('/register', function(req, res) {
  //4. paste original post and save to the bcrypt function:

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });

    newUser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render('secrets');
      }
    });
  });

});

app.post('/login', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;


  User.findOne({
    email: username
  }, function(err, foundUser) {
    if (!err) {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result) {
    //5. incorporate bcrypt.compare to mongoose, salt and encrypt the login password and
    //check if it equals to (foundUser.password === result)
          if (result === true) {
            res.render('secrets');
          } else {
            res.send('password is not correct, try again');
          }
        });
      }
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
