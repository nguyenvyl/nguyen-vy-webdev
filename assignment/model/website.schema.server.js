module.exports=function(mongoose){

    var pageSchema = require("./page.schema.server.js")(mongoose);

    var webSchema = mongoose.Schema({
        _user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        description: String,
        pages: [pageSchema],
        dateCreated: {type: Date, default: Date.now}
    });

    //return mongoose.model("Website", webSchema);
    return webSchema;
};