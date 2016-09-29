var express = require('express');
var router = express.Router();
var templateDir = 'website/';
/* GET home page. */
router.get('/list', function(req, res, next) {
  res.render(templateDir + 'list', {title: 'Websites'});
});

router.get('/new', function(req, res, next) {
  res.render(templateDir + 'new', {title: 'New Website'});
});

router.get('/edit', function(req, res, next) {
  res.render(templateDir + 'edit', {title: 'Edit Website'});
});


module.exports = router;
