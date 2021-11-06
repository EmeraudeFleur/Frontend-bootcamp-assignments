require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

//1. npm i passport-facebook
//2. get app id, app secret.
//3. save to .env as FACEBOOK_APP_ID, FACEBOOK_APP_SECRET
//4. require strategy
const FacebookStrategy = require('passport-facebook').Strategy;
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


userSchema = new mongoose.Schema({
  email: String,
  password: String,
  facebookId: String,
  secret: [{
    type: String
  }]
});


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


//5. configure strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/secrets",
    enableProof: true
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({facebookId: profile.id}, function (err, user) {
      return cb(err, user);
    });
  }
  // function(accessToken, refreshToken, profile, cb) {
  //   //6. 自定义 findOrCreate function
  //   User.findOne({
  //     facebookId: profile.id
  //   }, function(err, user) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       if (!user) {
  //         user = new User({
  //           facebookId: profile.id,
  //         });
  //         user.save();
  //       } else {
  //         return cb(err, user);
  //       }
  //     }
  //   });
  // }
));



app.get('/', function(req, res) {
  res.render('home');
});

//7.
app.get('/auth/facebook',
  passport.authenticate('facebook'));

//8.
app.get('/auth/facebook/secrets',
  passport.authenticate('facebook', {
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

app.get('/secrets', function(req, res) {
  User.find({
    secret: {
      $ne: null
    }
  }, function(err, foundUsers) {
    if (err) {
      console.log(err);
    } else {
      if (foundUsers) {
        res.render('secrets', {
          usersWithSecrets: foundUsers
        });
      }
    }
  });
});


app.get('/submit', function(req, res) {
  if (req.isAuthenticated()) {
    res.render('submit');
  } else {
    res.redirect('/login');
  }
});



app.post('/submit', function(req, res) {
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


app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


app.post('/register', function(req, res) {

  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (err) {
      res.redirect('/register');
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/secrets');
      });
    }
  });
});


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
