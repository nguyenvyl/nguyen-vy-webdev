var express = require('express');
var router = express.Router();
var templateDir = 'user/';

router.get('/login', function(req, res, next) {
  res.render(templateDir + 'login', {title: 'Login'});
});

router.get('/profile', function(req, res, next) {
  res.render(templateDir + 'profile', {title: 'Profile'});
});

router.get('/register', function(req, res, next) {
  res.render(templateDir + 'register', {title: 'Register'});
});


module.exports = router;
