module.exports=function(mongoose){
    //var webSchema = require("./website.schema.server.js")(mongoose);
    //var webSchema = require("./website.schema.server.js")(mongoose);
    console.log("Hey, this is user.schema.server.js");

    var userSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
//        websites: [webSchema],
        dateCreated: {type: Date, default: Date.now}
    });

    //return mongoose.model("User", userSchema);
    return userSchema;
    //var userModel = mongoose.model("User", userSchema);
};