const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root1234",
  database: "test"
});


passport.use(new LocalStrategy({
  usernameField: 'email2',
  passwordField: 'psw2'
    },
    function (username, password, cb) {
        return con.query("SELECT * FROM users WHERE email = ?", [username], function (err, result, fields) {
          if (err) throw err;
          bcrypt.compare(password, result[0].password, function(err, doesMatch){
            .then(user => {
              if (!user) {
                   return cb(null, false, {message: 'Incorrect email.'});
              }
              if (!user.validPassword(password)) {
                  return done(null, false, { message: 'Incorrect password.' });
              }
              return cb(null, user, {message: 'Logged In Successfully'});
            })
            .catch(err => cb(err));
          })
        })
    }
));
