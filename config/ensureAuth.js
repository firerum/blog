// to ensure user must be logged in to create an article
module.exports = {
   ensureAuthenticate: function(req, res, next) {
      if(req.isAuthenticated()) {
         return next();
      }
      res.redirect("/users/login");
   }
};