require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//MongoDB connection through Mongoose
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("User", userSchema);

//Home Route
app.route("/")

.get(function(req, res) {
  res.render("home");
});

//Login Route

app.route("/login")

.get(function(req, res) {
  res.render("login");
})

.post(function(req, res) {

  const password = req.body.password;

  User.findOne(
    {email: req.body.username},
    function(err, foundUser) {
      if (!err) {
        if (foundUser) {
          if (foundUser.password === req.body.password) {
            res.render("secrets");
          } else {
            res.send("The username or password is incorrect. Please try again.");
          }
        } else {
          res.send("No user was found. Please try again");
        }
      } else {
        console.log(err);
      }
    }
  );
});

//Register route
app.route("/register")

.get(function(req, res) {
  res.render("register");
})

.post(function(req, res) {
  const newUser = User ({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err) {
    if (!err) {
      res.render("secrets");
    } else {
      console.log(err);
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
