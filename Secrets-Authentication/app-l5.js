//cookies and sessions
//keep authenticated while in login window

//docs: passportjs; npmjs express-session; passport-local-mongoose;

//1. npm i passport passport-local passport-local-mongoose express-session
const express = require('express');
const app = express();
const mongoose = require('mongoose');

//2. require express-session; passport; passport-local-mongoose;
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');


app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

//3. set express-session
app.use(session({
  secret: 'our little secrets',
  resave: false,
  saveUninitialized: true
}));

//4. initialise passport
app.use(passport.initialize());

//5. tell passport to set up session
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

userSchema = new mongoose.Schema({
  email: String,
  password: String
});

//6. plugin passport-local in schema:
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);
//passportjs use is more complex

//7. use passport-local strategy and serialise串联(user-id & cookies)/deserialise并联(cookies broken)through mongoose
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/', function(req, res) {
  res.render('home');
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.get('/register', function(req, res) {
  res.render('register');
});

//9. get '/secrets' route after post request only if authenticated
app.get('/secrets', function(req, res) {
  if (req.isAuthenticated()) {
    res.render('secrets');
  } else {
    res.redirect('/login');
  }
});

//11. add '/logout' get route to logout and test cookies. /secrets href="/logout"
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

//8. authenticate register user
app.post('/register', function(req, res) {
  //in this level, not using email anymore
  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (err) {
      res.redirect('/register');
    } else {
      //function currying: the first parentheses returns another function
      passport.authenticate('local')(req, res, function() {
        res.redirect('/secrets');
      });
    }
  });
});

//10. authenticated login

app.post('/login', function(req, res) {

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
req.login(user, function(err){
  if (err) {
    console.log(err);
  } else {
    passport.authenticate('local')(req,res,function(){
      res.redirect('/secrets');
    });
  }
});
});

//more simple:

// app.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/secrets",
//     failureRedirect: "/login",
//   })
// );

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
