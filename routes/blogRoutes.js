const express = require("express");
const router = express.Router();
const blogControllers = require("../controllers/blogControllers.js");
const { ensureAuthenticate } = require("../config/ensureAuth");

// get all blogs
router.get("/", blogControllers.blog_all);

// get single blog
router.get("/:id", blogControllers.blog_details);

// delete blog
router.delete("/:id", blogControllers.blog_delete);

// create new blog
router.post("/", blogControllers.blog_create);

// exports the router
module.exports = router;