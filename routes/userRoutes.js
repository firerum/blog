const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const { ensureAuthenticate } = require("../config/ensureAuth");

router.get("/", userController.all_users);
router.get("/register", userController.add_new_user);
router.get("/login", userController.show_login);
router.get("/dashboard", ensureAuthenticate, userController.dashboard_user);
router.get("/logout", userController.log_out);

router.post("/login", userController.log_user_in);
router.post("/register", userController.save_new_user);


// exports the user routes 
module.exports = router;