module.exports=function(mongoose){

    var pageSchema = require("./page.schema.server.js")(mongoose);

    var websiteSchema = mongoose.Schema({
        _user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        description: String,
        pages: [pageSchema],
        dateCreated: {type: Date, default: Date.now}
    });
    return websiteSchema;
};