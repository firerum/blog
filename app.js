const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const { ensureAuthenticate } = require("./config/ensureAuth");
const blogRoutes = require("./routes/blogRoutes");
const userRoutes = require("./routes/userRoutes");
require("./config/passport")(passport);


// PORT 
const port = process.env.PORT || 3000;

// express app
const app = express();

// Database
/* const db = "mongodb+srv://firerum:nobles001@cluster0.ajhls.mongodb.net/FirstProject?retryWrites=true&w=majority"; */
const db = "mongodb://localhost/Try";
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
   .then((result) => {
      console.log("connected to database");
      // Listen at port 3000
      app.listen(port, () => {
         console.log("now listening at port: " + port);
      });
   })
   .catch((err) => {
      console.log("couldnt coonect to the database for some reason: ", err);
   });

app.set("view engine", "ejs");

app.use(express.static("public")); // Load my external files like stylesheet
app.use(morgan("dev")); // Track the url routes
app.use(express.urlencoded({extended: true})); // translate the post request to usable file
app.use(session({  // for the express session
   secret: "secret",
   resave: true,
   saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// global variables - custom middlewares
app.use((req, res, next) => {
   res.locals.success_msg = req.flash("success_msg");
   res.locals.error_msg = req.flash("error_msg");
   res.locals.error = req.flash("error");
   next();
});

// Get Requests
app.get("/", (req, res) => {
   res.render("index", {title: "HomePage"});
});

// user Routes
app.use("/users", userRoutes);

// blog routes
app.use("/blogs", blogRoutes);

app.get("/dashboard/new-blog/", ensureAuthenticate, (req, res) => {
   res.render("new-blog", {title: "Create New Blog"});
});

app.get("/contact", (req, res) => {
   res.render("contact", {title: "Contact"});
});

app.use((req, res) => {
   res.status(404);
   res.render("404.ejs", {title: "404"});
});