(function() {
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);
    function WidgetService() {
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
            ],
            api;

        function createWidget(pageId, widget) {
            widget.pageId = pageId;
            widgets.push(widget);
        }

        function findWidgetsByPageId(pageId){
            var pageWidgets = [];
            for(var w in widgets){
                if(widgets[w].pageId === pageId){
                    pageWidgets.push(widgets[w]);
                }
            }
            return pageWidgets;
        }

        function findWidgetById(widgetId){
            for(var w in widgets){
                if(widgets[w]._id === widgetId){
                    return widgets[w];
                }
            }
        }

        function updateWidget(widgetId, widget){
            for(var w in widgets){
                if(widgets[w]._id === widgetId){
                    widgets[w] = widget;
                    break;
                }
            }
        }

        function deleteWidget(widgetId){
            for(var w in widgets){
                if(widgets[w]._id === widgetId){
                    widgets.splice(w, 1);
                    break;
                }
            }
        }
        api = {
            createWidget        : createWidget,
            findWidgetsByPageId : findWidgetsByPageId,
            findWidgetById      : findWidgetById,
            updateWidget        : updateWidget,
            deleteWidget        : deleteWidget
        };
        return api;

    }
})();
