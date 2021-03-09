const { populate } = require("../models/blog");
const Blog = require("../models/blog");
const User = require("../models/User");

// get all blogs 
const blog_all = (req, res) => {
   Blog.find().populate("author").sort({createdAt: -1}) // sort and list the blogs from the newest
      .then((result) => {
         res.render("blogs", {title: "All Blogs", blogs: result});  
      })
      .catch((err) => {
         console.log("couldn't fetch blogs from the database", err);
      });
};

// get single blog details
const blog_details = (req, res) => {
   const id = req.params.id;
   Blog.findById(id)
      .then((result) => {
         res.render("details", {title: "Blog Details", blog: result});
      })
      .catch((err) => {
         console.log("Couldn't get this particular blog", err);
      });
};

// delete single blog
const blog_delete = (req, res) => {
   const id = req.params.id;
   Blog.findByIdAndDelete(id)
      .then((result) => {
         res.json({redirect: "/blogs"});
      })
      .catch((err) => {
         console.log("there was an error", err);
      });
};

// create new blog(s)
const blog_create = (req, res) => {
   // Get the data input of the form and save it to the database
   const blog = new Blog(req.body);
   
   // because new-blog route is authenticated, I have access to the user's details in "req.user"
   const userId = req.user.id;
   
   // link the blog to the user
   blog.author = userId;

   // save the new blog into the database
   blog.save()
      .then((result) => {
         // push new blog created to the user's article collection
         User.findById(userId)
            .then(user => {
               user.articles.push(result);
               user.save();
            });
         res.redirect("/users/dashboard");
      })
      .catch((err) => {
         console.log("could't save to the database for some reason", err);
      });
};

// exports the function handlers
module.exports = {
   blog_all,
   blog_details,
   blog_delete,
   blog_create
};