const passportLocal = require("passport-local");
const LocalStrategy = passportLocal.Strategy;
const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = function(passport) {
   passport.use(
      new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
         // check if user exists
         User.findOne({ email: email })
            .then(user => {
               if(!user) {
                  return done(null, false, { message: "User doesn't not exist"});
               } 

               // Compare hashed password with the new password
               bcrypt.compare(password, user.password, (err, isMatch) => {
                  if(err) throw err;

                  if(isMatch) {
                     return done(null, user);   
                  } else {
                     return done(null, false, { message: "password incorrect" });
                  }
               }); 
            })
            .catch(err => {
               console.log(err, "there was an error during authentication");
            });
      })
   );

    // serialize and deserialize user
    passport.serializeUser((user, done) => {
      done(null, user.id);
   });

   passport.deserializeUser((id, done) => {
      User.findById(id, (err, user) => {
         done(err, user);
      });
   });
};
