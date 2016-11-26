(function(){
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController);

    function WidgetListController($routeParams, $sce, WidgetService) {
        var vm = this;
        vm.pageId = $routeParams.pid;
        vm.websiteId = $routeParams.wid;
        vm.userId = $routeParams.uid;
        vm.trustHTML = trustHTML;
        vm.trustURL = trustURL;
        vm.embedYoutube = embedYoutube;
        vm.sortItem = sortItem;

        function init() {
            var listPromise = WidgetService.findAllWidgetsForPage(vm.pageId);
            listPromise
                .success(function(widgets){
                    vm.widgets = widgets;
                    console.log(vm.widgets);
                });

        }
        init();

        // Sorts widgets whenever they're dragged and dropped.
        // Each widget has an 'index' field, which keeps track of its position in the page's list of widgets.
        function sortItem(start, end) {
            console.log("start: " + start);
            console.log("end: " + end);

            // Updates the current widget array so that sorting is immediately viewable to the user.
            var moved = vm.widgets.splice(start, 1)[0];
            vm.widgets.splice(end, 0, moved);

            // We also need to update the widget's index and update the database accordingly.
            // Otherwise, the widget's order will not be saved.

            // Account for case when a widget is taken from a later to an earlier position in the list.
            if(start > end){
                var tempEnd = end;
                end = start;
                start = tempEnd;
            }

            // Update all widget indices that were affected by the widget move.
            for (i = start; i <= end; i++) {
                vm.widgets[i].index = i;
                var promise = WidgetService.updateWidget(vm.widgets[i]._id, vm.widgets[i]);
                promise
                    .success(function () {

                    });
            }
        }

        function trustHTML(htmlCode){
            return $sce.trustAsHtml(htmlCode);
        }

        function trustURL(url){
            return $sce.trustAsResourceUrl(url);
        }

        function embedYoutube(youtube){
            var vidID = getYoutubeID(youtube);
            var embedURL = "https://www.youtube.com/embed/" + vidID;
            return embedURL;
        }

        // Function used to parse the video ID from a YouTube URL.
        // The regex is designed to handle a variety of YouTube URL formats.
        function getYoutubeID(youtube){
            var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = youtube.match(regExp);
            if (match && match[2].length == 11) {
                return match[2];
            } else {
                return "Youtube link not valid";
            }
        }
    }

    function NewWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        vm.createWidget = createWidget;

        function init() {
            var listPromise = WidgetService.findAllWidgetsForPage(vm.pageId);
            listPromise
                .success(function(widgets){
                    vm.widgets = widgets;
                });
        }
        init();

        function createWidget(widgetType) {

            //console.log(vm.widgets);
            var newWidget;

            switch(widgetType) {
                case "HEADER":
                    newWidget = { widgetType: "HEADER", size: 1, text: ""};
                    break;
                case "HTML":
                    newWidget = {widgetType: "HTML", text: ""};
                    break;
                case "YOUTUBE":
                    newWidget = {widgetType: "YOUTUBE", width:"100%", url:""};
                    break;
                case "IMAGE":
                    newWidget = {widgetType: "IMAGE", width: "100%", url: ""};
                    break;
                case "TEXT":
                    newWidget = {widgetType: "TEXT", rows: 1, placeholder: "", formatted: true };
                    break;
            }

            // New widgets are, by default, added to the end of the widget list.
            newWidget.index = vm.widgets.length;

            WidgetService
                .createWidget(vm.pageId, newWidget)
                .success(function (retVal) {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + retVal._id);
                });
        }
    }

    function EditWidgetController($routeParams, $location, $http, WidgetService){
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        vm.widgetId = $routeParams.wgid;
        vm.editHEADER = editHEADER;
        vm.editHTML = editHTML;
        vm.editIMAGE = editIMAGE;
        vm.editYOUTUBE = editYOUTUBE;
        vm.editTEXT = editTEXT;
        vm.deleteWidget = deleteWidget;
        vm.uploadImage = uploadImage;


        function init() {
            var widgetPromise = WidgetService.findWidgetById(vm.widgetId);
            widgetPromise
                .success(function(widget){
                    vm.widget = widget;
                });

            var listPromise = WidgetService.findAllWidgetsForPage(vm.pageId);
            listPromise
                .success(function(widgets){
                    vm.widgets = widgets;
                });
        }
        init();

        
        function editHTML(){
            if(!vm.widget.name){
                console.log("Please provide text for your widget.");
                return;
            }
            if(!vm.widget.text){
                console.log("Please provide text for your widget.");
                return;
            }
            WidgetService
                .updateWidget(vm.widgetId, vm.widget)
                .success(function(widget){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
                })
        }

        // This allows changes to a YouTube widget. It also checks for valid input for the width value.
        function editYOUTUBE() {
            if(!vm.widget.name){
                vm.alert = "Please provide a name for your widget.";
                return;
            }
            var checkWidth = formatWidth(vm.widget.width);
            if(checkWidth){
                vm.widget.width = checkWidth;
                WidgetService
                    .updateWidget(vm.widgetId, vm.widget)
                    .success(function(widget){
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
                    })
            }
        }

        function editHEADER(){
            if(!vm.widget.name){
                vm.alert = "Please provide a name for your widget.";
                return;
            }
            if(!vm.widget.text){
                vm.alert = "Please provide text for your widget.";
                return;
            }

            if(vm.widget.size < 1 || vm.widget.size > 6){
                vm.alert = "Header size can only be between 1 and 6."
                return;
            }
            else {
                WidgetService
                    .updateWidget(vm.widgetId, vm.widget)
                    .success(function(widget){
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
                    })
            }
        }

        function editIMAGE(width, file){
            if(!vm.widget.name){
                vm.alert = "Please provide a name for your widget.";
                return;
            }
            var checkWidth = formatWidth(width);
            if(checkWidth){
                vm.widget.width = checkWidth;
                WidgetService
                    .updateWidget(vm.widgetId, vm.widget)
                    .success(function(widget){
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
                    })
            }
        }

        function editTEXT(){
            if(!vm.widget.name){
                vm.alert = "Please provide a name for your widget.";
                return;
            }
            if(!vm.widget.text){
                vm.alert = "Please provide text for your widget.";
                return;
            }
            WidgetService
                .updateWidget(vm.widgetId, vm.widget)
                .success(function(widget){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
                })
        }

        function uploadImage(file){
            console.log(file);
            var uploadUrl = "api/upload";
            var fd = new FormData();
            fd.append('file', file);

            $http.post(uploadUrl,fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
                .success(function(){
                    console.log("Image uploaded!");
                })
                .error(function(){
                    console.log("Image upload error!!");
                });

        }

        function deleteWidget(widgetId){

            var indexToDel = vm.widget.index;
            var deleted = vm.widgets.splice(indexToDel, 1)[0];

            WidgetService
                .deleteWidget(widgetId)
                .success(function(widget){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
                });

            // When a widget is deleted, the indices of all widgets following it need to be updated to maintain the list order.
            for(i = indexToDel; i < vm.widgets.length; i++){
                vm.widgets[i].index = i;
                var promise = WidgetService.updateWidget(vm.widgets[i]._id, vm.widgets[i]);
                promise
                    .success(function () {

                    });
            }
        }

        // Checks if a string is a number between 1 and 100.
        function is1to100(string){
            var regExNumber = /^[1-9][0-9]?$|^100$/;
            return string.match(regExNumber);
        }

        // Checks if a string is a valid percentage string (i.e., '100%' or '3%')
        function isPercentage(string){
            var regExPercent = /[0-9]{1,3}%/;
            return string.match(regExPercent);
        }

        // Takes in user input for width, and returns it as
        // a valid percentage string that can be used in HTML.
        function formatWidth(width){
            if(is1to100(width)){
                return width + "%";
            }
            else if(isPercentage(width)){
                return width;
            }
            else{
                vm.alert = "Please input a valid percentage for width."
            }
        }

    }

})();

