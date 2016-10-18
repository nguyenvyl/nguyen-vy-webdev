var routes = require('./routes/index');
var users = require('./routes/users');
var pages = require('./routes/pages');
var widget = require('./routes/widget');
var user = require('./routes/user');
var website = require('./routes/website');



module.exports = function (app) {
    app.use('/', routes);
    app.use('/users', users);
    app.use('/pages', pages);
    app.use('/widget', widget);
    app.use('/user', user);
    app.use('/website', website)
};