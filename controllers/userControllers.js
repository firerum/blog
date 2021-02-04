const User = require("../models/User");
const passport = require("passport");
const bcrypt = require("bcryptjs");


// get handlers
const all_users = (req, res) => {
   User.find()
      .then(users => {
         res.render("user/everyuser", {
            title: "All Bloggers",
            users: users
         });
      })
      .catch(err => {
         console.log("error fetching users", err);
      });
   
};

const add_new_user = (req, res) => {
   res.render("user/register", { title: "Registration" });
}; 

const show_login = (req, res) => {
   res.render("user/login", { title: "Login" });
};

// user dashboard
const dashboard_user = (req, res) => {
   res.render("user/dashboard", { title: "dashboard", user: req.user});
}; 


// post handlers
const save_new_user = (req, res) => {
   const { firstname, lastname, email, password, password2} = req.body;

   // set up some authentications
  const errors = [];

  if(!firstname || !lastname || !email) {
     errors.push({ message: "Please fill all fields"} );
  }

  if(password.length < 4) {
   errors.push({ message: "Password must be at least four characters long"} );
  }

  if(password !== password2) {
     errors.push({ message: "Passwords do not match" });
  }

  if(errors.length > 0) {
     res.render("user/register", {
        errors,
        firstname,
        lastname,
        email,
        title: "Registration"
     });
  } else {
     User.findOne({email: email})
      .then(user => {
         if(user) {
            errors.push({ message: "email already exists" });
            res.render("user/register", {
               errors,
               firstname,
               lastname,
               email,
               title: "Registration"
            });
         } else {
            const freshUser = new User({
               firstname,
               lastname,
               email,
               password
            });
            
            // encrypt password before saving to the database
            bcrypt.genSalt(10, (err, salt) => bcrypt.hash(freshUser.password, salt, (err, hash) => {
               if(err) throw err;

               freshUser.password = hash;

               // save the user to the database with the hashed password
               freshUser.save()
               .then(user => {
                  res.redirect("/users/login");
               })
               .catch(err => {
                  console.log("couldn't save user");
               });
            }));
         }
      });
  }
};


// log user into the dashboard
const log_user_in = (req, res, next) => {
   passport.authenticate("local", {
      successRedirect: "/users/dashboard",
      failureRedirect: "/users/login"
   })(req, res, next);
};

// logout
const log_out = (req, res) => {
   req.logout();
   res.redirect("/users/login");
};


// exports the user controllers 
module.exports = {
   all_users,
   add_new_user,
   show_login,
   dashboard_user,
   save_new_user,
   log_user_in,
   log_out
};