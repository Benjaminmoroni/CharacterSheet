const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const shortid = require("shortid");
const mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root1234",
  database: "test"
});


passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'psw',
    passReqToCallback: true,
    session: false,
  },
  function(req, email, password, done) {
    var newId = shortid.generate();
    var today = new Date();
    bcrypt.hash(password, 10, function(err, hash) {
      let password = hash
      var sql = "INSERT INTO users SET id = ?, first_name = ?, last_name = ?, email = ?, password = ?, created = ?, modified = ?";

      con.query(sql, [newId, req.body.first_name, req.body.last_name, email, password, today, today], function (err, result, fields) {
        if (err) throw err;
        return done(null, email);
      });
    });
  }
));

passport.use('login', new LocalStrategy({
  usernameField: 'email2',
  passwordField: 'psw2'
  },
  (username, password, done) => {
    try {
      con.query("SELECT * FROM users WHERE email = ?", [username], function (err, result, fields) {
        if (!result) {
          console.log('Incorrect email.')

             return done(null, false, {message: 'Incorrect email.'});
        }
        bcrypt.compare(password, result[0].password, function(err, doesMatch){


            if (!doesMatch) {
                console.log('Incorrect password.')
                return done(null, false, { message: 'Incorrect password.' });
            }
            var user = {
              id: result[0].id,
              email: result[0].email,
            }
            console.log('Logged In Successfully')
            return done(null, user, {message: 'Logged In Successfully'});
        })
      })
    } catch(error) {
  return done(null, false, {message: 'Could not Authenticate'});
    }
  }
));
