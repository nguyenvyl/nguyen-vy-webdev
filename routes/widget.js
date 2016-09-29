var express = require('express');
var router = express.Router();
var templateDir = 'widget/';
/* GET home page. */
router.get('/list', function(req, res, next) {
  res.render(templateDir + 'list', {title: 'Widgets'});
});

router.get('/choose', function(req, res, next) {
  res.render(templateDir + 'choose', {title: 'Choose Widget'});
});

router.get('/heading', function(req, res, next) {
  res.render(templateDir + 'heading', {title: 'Widget Edit'});
});

router.get('/image', function(req, res, next) {
  res.render(templateDir + 'image', {title: 'Widget Edit'});
});

router.get('/youtube', function(req, res, next) {
  res.render(templateDir + 'youtube', {title: 'Widget Edit'});
});

module.exports = router;
