// var express = require('express');
// var path = require('path');
// //var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
//
// //var routes = require('./routes/index');
// //var users = require('./routes/users');
//
// var app = express();
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// //app.set('view engine', 'jade');
//
// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// //app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
//
// require("./test/app.js")(app);
//
//
// app.get('/', function(req, res){
//   res.render('index.html');
// });
//
// require("./assignment/app.js")(app);
//
// module.exports = function(app) {
//   require("./services/user.service.server.js")(app);
//   // require("./services/website.service.server.js")(app);
//   // require("./services/page.service.server.js")(app);
//   // require("./services/widget.service.server.js")(app);
// };
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handlers
//
// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });
//
//
// module.exports = app;

module.exports = function(app, mongoose, db) {

    console.log("Hello from assignment/app.js");

    var connectionString = 'mongodb://testuser:testuser@ds033106.mlab.com:33106/nguyenvyl_webdev';

    var mongoose = require("mongoose");
    var db =  mongoose.connect(connectionString);
    var db_connection = mongoose.connection;

    //test if the connected successfully
    db_connection.on('connected', function(){
        console.log("Connected to Mongo DB successfully!");
    });

    db_connection.on('error', function(){
        console.log("Mongo DB connection error!");
    });

    db_connection.on('disconnected', function(){
        console.log("Mongo DB disconnected!");
    });


  var UserModel = require("./model/user.model.server.js")(mongoose, db);
  require("./services/user.service.server.js")(app, UserModel);

  var WebsiteModel = require("./model/website.model.server.js")(mongoose, db);
  require("./services/website.service.server.js")(app, WebsiteModel);

  var PageModel =  require("./model/page.model.server.js")(mongoose, db);
  require("./services/page.service.server.js")(app, PageModel);

  var WidgetModel =  require("./model/widget.model.server.js")(mongoose, db);
  require("./services/widget.service.server.js")(app, WidgetModel);
};