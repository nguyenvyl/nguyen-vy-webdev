var express = require('express');
var router = express.Router();
var templateDir = 'pages/';
/* GET home page. */
router.get('/list', function(req, res, next) {
  res.render(templateDir + 'list', {title: 'Pages'});
});

router.get('/new', function(req, res, next) {
  res.render(templateDir + 'new', {title: 'New Page'});
});

router.get('/edit', function(req, res, next) {
  res.render(templateDir + 'edit', {title: 'Edit Page'});
});


module.exports = router;
