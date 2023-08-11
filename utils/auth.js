const withAuth = (req, res, next) => {
   
    if (!req.session.loggedIn) {
      res.redirect('/login');
    } else {
      next();
    }
  };
  
  
  const areAuth = (req, res, next) => {
 
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    } else {
      next();
    }
  };
  
  
  module.exports = { withAuth, areAuth };
  