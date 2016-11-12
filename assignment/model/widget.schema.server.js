module.exports=function(mongoose){

    var widgetSchema = mongoose.Schema({
        _page: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Page'
        },
        name: String,
        title: String,
        description: String,
        dateCreated: {type: Date, default: Date.now}
    });

    //return mongoose.model("Website", webSchema);
    return widgetSchema;
};