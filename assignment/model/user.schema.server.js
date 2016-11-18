module.exports=function(mongoose){

    var websiteSchema = require("./website.schema.server.js")(mongoose);

    var userSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        //websites: [websiteSchema],
        _websites:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Website'
        }],
        dateCreated: {type: Date, default: Date.now}
    });

    return userSchema;
};