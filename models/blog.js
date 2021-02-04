const mongoose = require("mongoose");
// Create a schema constructor
const Schema = mongoose.Schema;

const blogSchema = new Schema({
   // This is where we will now define the structure of the blog document
   title: {
      type: String,
      required: true
   },
   snippet: {
      type: String,
      required: true
   },
   body: {
      type: String,
      required: true
   },
   author: {
      type: Schema.Types.ObjectId,
      ref: "User"
   }
}, {timestamps: true});

const Blog = mongoose.model("Blog", blogSchema); // the name must tally with the database collection, however this one must be singular as the mongoose will pluralize it for us

// Export the blog object
module.exports = Blog;