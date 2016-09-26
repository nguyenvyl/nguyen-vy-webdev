var express = require('express');
var router = express.Router();
var templateDir = 'website/';
/* GET home page. */
router.get('/list', function(req, res, next) {
  res.render(templateDir + 'list', {});
});

router.get('/new', function(req, res, next) {
  res.render(templateDir + 'new', {});
});

router.get('/edit', function(req, res, next) {
  res.render(templateDir + 'edit', {});
});


module.exports = router;
