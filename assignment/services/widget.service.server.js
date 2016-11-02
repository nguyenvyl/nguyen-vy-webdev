var _ = require('lodash');

module.exports = function(app, WidgetModel) {
    console.log("Hi! This is your friendly neighborhood widget service!");
    var widgets = [
            { _id: 123, widgetType: "HEADER", pageId: 321, size: 2, text: "GIZMODO"},
            { _id: 234, widgetType: "HEADER", pageId: 321, size: 4, text: "Lorem ipsum"},
            { _id: 345, widgetType: "IMAGE", pageId: 321, width: "100%",
                url: "http://lorempixel.com/400/200/"},
            { _id: 456, widgetType: "HTML", pageId: 321, text: "<p>Lorem ipsum</p>"},
            { _id: 567, widgetType: "HEADER", pageId: 321, size: 4, text: "Lorem ipsum"},
            { _id: 678, widgetType: "YOUTUBE", pageId: 321, width: "100%",
                url: "https://youtu.be/AM2Ivdi9c4E" },
            { _id: 789, widgetType: "HTML", pageId: 321, text: "<p>Lorem ipsum</p>"},
            { _id: 777, widgetType: "HTML", pageId: 343, text: "<p>Vy's test html paragraph</p>"},
            { _id: 778, widgetType: "HEADER", pageId: 343, size: 4, text: "Vy's test header"},
            { _id: 779, widgetType: "YOUTUBE", pageId: 343, width:"100%", url:"https://youtu.be/Wsx9f8tdifw"},
            { _id: 222, widgetType: "IMAGE", pageId: 343, width: "100%",
                url: "https://ithinkincomics.files.wordpress.com/2016/03/post-202-image-1.jpg?w=502&h=648"},
        ];


    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../public/uploads' });
    function uploadImage(req, res) {
        var widgetId      = req.body.widgetId;
        var width         = req.body.width;
        var myFile        = req.file;
        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        res.send(myFile);
    }

    function createWidget(req, res) {
        console.log("Hi from createWidget - server side!");
        var widget = req.body;
        console.log("Here's the widget we're adding: ");
        console.log(widget);
        widgets.push(widget);
        res.send(widget);
    }

    function findAllWidgetsForPage(req, res) {
        console.log("This is find all widgets for user, server!")
        var uid = req.params.userId;
        var result = [];
        for(var w in widgets) {
            if(widgets[w].developerId == uid) {
                result.push(widgets[w]);
            }
        }
        res.json(result);
    }

    function findWidgetById(req, res){
        // console.log("This is find widget by ID, server side!");
        var widgetId = parseInt(req.params.widgetId);

        var widget = _.find(widgets, function(widget){
            return widget._id === widgetId;
        });
        // console.log("Here's the widget we found for id " + widgetId);
        // console.log(widget);
        res.send(widget || '0');
    }

    function updateWidget(req, res){
        // console.log("This is update widget, server!");
        // console.log("Here's the update we want:");
        var update = req.body;
        // console.log(update);

        var widgetId = parseInt(req.params.widgetId);
       // console.log("The widget's id is " + widgetId);
        for(var p in widgets) {
            if(widgets[p]._id === widgetId) {
                widgets[p] = update;
            }
        }
        res.sendStatus(200);
    }

    function deleteWidget(req, res){
        console.log("Hello from deleteWidget - server");
        var widgetId = parseInt(req.params.widgetId);
        console.log("We're trying to delete widget with ID " + widgetId);

        for(var p in widgets) {
            if(widgets[p]._id === widgetId) {
                console.log("We found em!");
                widgets.splice(p, 1);
            }
        }
        res.sendStatus(200);
    }

    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.post("/api/page/:pageId/widget", createWidget);
    app.put("/api/widget/:widgetId", updateWidget);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.delete("/api/widget/:widgetId", deleteWidget);
    app.post("/api/upload", upload.single('myFile'), uploadImage);


};