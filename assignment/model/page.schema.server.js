module.exports=function(mongoose){

    var widgetSchema = require("./widget.schema.server.js")(mongoose);
    var pageSchema = mongoose.Schema({
        _website: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Website'
        },
        name: String,
        title: String,
        description: String,
        _widgets: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Widget'
        }],
        dateCreated: {type: Date, default: Date.now}
    });

    //return mongoose.model("Website", webSchema);
    return pageSchema;
};