module.exports = function(app, mongoose, db) {

    console.log("Hello from project/app.js");

    var connectionString = 'mongodb://testuser:testuser@ds033106.mlab.com:33106/nguyenvyl_webdev';

    // var connectionString = 'mongodb://localhost:5000/webdevproject';

    var mongoose = require("mongoose");
    var db =  mongoose.connect(connectionString);
    var db_connection = mongoose.connection;

    //test if the connected successfully
    db_connection.on('connected', function(){
        console.log("project app Connected to Mongo DB successfully!");
    });

    db_connection.on('error', function(){
        console.log("project app Mongo DB connection error!");
    });

    db_connection.on('disconnected', function(){
        console.log("project app Mongo DB disconnected!");
    });


    // Setting up dependencies for the user database
    var userSchema = require("./server/model/user.schema.server.js")(mongoose);
    var trailSchema = require("./server/model/trail.schema.server.js")(mongoose);
    var TrailMongooseModel = mongoose.model("Trail", trailSchema);
    var UserMongooseModel = mongoose.model("ProjectUser", userSchema);
    var UserModel = require('./server/model/user.model.server.js')(mongoose, db, UserMongooseModel, TrailMongooseModel);
    var TrailModel = require('./server/model/trail.model.server.js')(mongoose, db, TrailMongooseModel, UserModel);

    require('./server/services/user.service.server.js')(app, UserModel, TrailModel);
    require('./server/services/trail.service.server.js')(app, TrailModel, UserModel);


};