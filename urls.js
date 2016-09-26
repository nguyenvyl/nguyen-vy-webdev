var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var register = require('./routes/register');
var website = require('./routes/website');
var profile = require('./routes/profile');
var pages = require('./routes/pages');


module.exports = function (app) {
    app.use('/', routes);
    app.use('/users', users);
    app.use('/login', login);
    app.use('/register', register);
    app.use('/website', website);
    app.use('/profile', profile);
    app.use('/pages', pages);

};