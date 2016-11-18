module.exports=function(mongoose){

    var pageSchema = require("./page.schema.server.js")(mongoose);

    var websiteSchema = mongoose.Schema({
        _user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        description: String,
        _pages: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Page'
        }],
        dateCreated: {type: Date, default: Date.now}
    });
    return websiteSchema;
};