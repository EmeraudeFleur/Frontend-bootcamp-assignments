//third party OAuth: open standard for access delegation,
//commonly used as a way for Internet users to grant websites or applications access
//to their information on other websites but without giving them the passwords.
//basically asking trustworthy apps to authenticate our users for us

//-- granuler 颗粒状 access level, eg. asking photo, name, or other profile info
//-- read/ read + write access, eg. post somthing.
//-- revoke access 取消权限

//how does OAuth work?
//-- set up our app, let the big organisations know our application, get clientId/appId
//-- reidrect to authenticate, redirect users to their familiar apps to register or login
//-- users login on the actual web pages
//-- user grants permisions to our app
//-- after then, our app receive an authorisation code from the authenticate app (auth code, one time access),
//to make sure that users successfuly loged in or signed up.
//optinal, our app can request an access token from that app (access token, year pass to request pieces of information)


//using passport-google-oauth20
//1. npm i passport-google-oauth20

//2. follow the instruction on passportjs, get clientId and clientSecret from google.
//3. save them to .env

require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

//4. require GoogleStrategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.use(session({
  secret: 'our little secrets',
  resave: false,
  saveUninitialized: true
}));


app.use(passport.initialize());


app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

//11. add googleId key, it's a unique id to not duplicate users.
userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: [{type: String}]
});

//12. add bootstrap socal buttons style css to public, add link to header.ejs

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());

//10. change it to passportjs original way
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//5. configure strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {

    //6. function findOrCreate: 第一种方法———— mongoose-findorcreate; 第二种方法———— original solution
    //第一种:npm install mongoose-findorcreate; 2. require; 3. add plugin; (google)
    //第二种:在成功搞定Google验证登陆之后，自己尝试Facebook验证登陆，并在这一步不用mongoose-findorcreate.看app-l6-2.js

    User.findOrCreate({
      googleId: profile.id
    }, function(err, user) {
      // console.log(profile);
      return cb(err, user);
    });
  }
));



app.get('/', function(req, res) {
  res.render('home');
});

//7. add google sign in and sign up buttons in ejs

//8. redirect to google authenticate using GoogleStrategy, along with scope (similar to passport-local strategy)
///////USE function(req,res){} will let the page loading, instead, code like so:
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile']
}));

//9. google redirect user back to localhost
app.get('/auth/google/secrets',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect('/secrets');
  });


app.get('/login', function(req, res) {
  res.render('login');
});

app.get('/register', function(req, res) {
  res.render('register');
});

//originally: get '/secrets' route after post request only if authenticated

//14. change to display all secrets submitted by all users:
app.get('/secrets', function(req, res) {
  User.find({secret: {$ne: null}}, function(err, foundUsers){
    if (err){
      console.log(err);
    } else {
      if(foundUsers){
        res.render('secrets', {usersWithSecrets: foundUsers});
        //display secrets in secrets.ejs
      }
    }
  });
});

//12. get submit
app.get('/submit', function(req, res) {
  if (req.isAuthenticated()) {
    res.render('submit');
  } else {
    res.redirect('/login');
  }
});


//13. post submitted secrets
app.post('/submit', function(req, res) {
  // add a secret array to the userSchema
  // save user secret linked with their id

  // `req.user` contains the authenticated user. It's a passport method
  User.findById(req.user.id, function(err, foundUser) {

    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        foundUser.secret.push(req.body.secret);
        foundUser.save(function() {
          res.redirect('/secrets');
        });
      }
    }
  });

});


//add '/logout' get route to logout and test cookies. /secrets href="/logout"
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

//authenticate register user
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

//authenticated login

app.post('/login', function(req, res) {

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/secrets');
      });
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
