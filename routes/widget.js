var express = require('express');
var router = express.Router();
var templateDir = 'widget/';
/* GET home page. */
router.get('/list', function(req, res, next) {
  res.render(templateDir + 'list', {});
});

router.get('/choose', function(req, res, next) {
  res.render(templateDir + 'choose', {});
});

router.get('/heading', function(req, res, next) {
  res.render(templateDir + 'heading', {});
});

router.get('/image', function(req, res, next) {
  res.render(templateDir + 'image', {});
});

router.get('/youtube', function(req, res, next) {
  res.render(templateDir + 'youtube', {});
});

module.exports = router;
