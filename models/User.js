const mongoose = require("mongoose");
// Create a schema constructor
const Schema = mongoose.Schema;

// the user structure to define how data is stored on the database
const userSchema = new Schema({
   lastname: {
      type: String,
      required: true
   },
   firstname: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   Date: {
      type: Date,
      default: Date.now
   },
   articles: [{
      type: Schema.Types.ObjectId,
      ref: "Blog"
   }]
  
}, { timestamps: true });

// create the model to manipulate the database
const User = mongoose.model("User", userSchema);

// export the model
module.exports = User;