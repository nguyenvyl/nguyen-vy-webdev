(function(){
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController);

    function WidgetListController($routeParams, $sce, WidgetService) {
        var vm = this;
        vm.pageId = parseInt($routeParams["pid"]);
        vm.websiteId = parseInt($routeParams["wid"]);
        vm.userId = parseInt($routeParams["uid"]);
        vm.trustHTML = trustHTML;
        vm.trustURL = trustURL;
        vm.embedYoutube = embedYoutube;

        function init() {
            vm.widgets = WidgetService.findWidgetsByPageId(vm.pageId);

        }
        init();

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
        vm.userId = parseInt($routeParams["uid"]);
        vm.websiteId = parseInt($routeParams["wid"]);
        vm.pageId = parseInt($routeParams["pid"]);
        vm.createWidget = createWidget;

        function createWidget(widgetType) {
            var widgetId = getRandomInt(100, 999);
            while(WidgetService.findWidgetById(widgetId)){
                widgetId = getRandomInt(100, 999);
            }

            var newWidget;

            switch(widgetType) {
                case "HEADER":
                    newWidget = { _id: widgetId, widgetType: "HEADER", pageId: vm.pageId, size: 1, text: ""};
                    break;
                case "HTML":
                    newWidget = { _id: widgetId, widgetType: "HTML", pageId: vm.pageId, text: ""};
                    break;
                case "YOUTUBE":
                    newWidget = { _id: widgetId, widgetType: "YOUTUBE", pageId: vm.pageId, width:"100%", url:""};
                    break;
                case "IMAGE":
                    newWidget = { _id: widgetId, widgetType: "IMAGE", pageId: vm.pageId, width: "100%",
                        url: ""};
                    break;
            }
            WidgetService.createWidget(vm.pageId, newWidget);
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + widgetId);
        }

        // To be replaced once Mongo DB is up and running.
        // For now, used to generate a unique 3-digit ID.
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }

    function EditWidgetController($routeParams, $location, WidgetService){
        var vm = this;
        vm.userId = parseInt($routeParams["uid"]);
        vm.websiteId = parseInt($routeParams["wid"]);
        vm.pageId = parseInt($routeParams["pid"]);
        vm.widgetId = parseInt($routeParams["wgid"]);
        vm.editHEADER = editHEADER;
        vm.editHTML = editHTML;
        vm.editIMAGE = editIMAGE;
        vm.editYOUTUBE = editYOUTUBE;
        vm.deleteWidget = deleteWidget;
        function init() {
            vm.widget = WidgetService.findWidgetById(vm.widgetId);
        }
        init();

        
        function editHTML(text){
            var update = {_id: vm.widgetId, widgetType: vm.widget.widgetType, pageId: vm.pageId, text: text };
            WidgetService.updateWidget(vm.widgetId, update);
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
        }

        // This allows changes to a YouTube widget. It also checks for valid input for the width value.
        function editYOUTUBE(url, width) {
            var checkWidth = formatWidth(width);
            if(checkWidth){
                var update = {_id: vm.widgetId, widgetType: vm.widget.widgetType, pageId: vm.pageId, width: checkWidth, url: url};
                WidgetService.updateWidget(vm.widgetId, update);
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
            }
        }

        function editHEADER(text, size){
            var update = { _id: vm.widgetId, widgetType: vm.widget.widgetType, pageId: vm.pageId, size: size, text: text};
            WidgetService.updateWidget(vm.widgetId, update);
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
        }

        function editIMAGE(url, width){
            var checkWidth = formatWidth(width);
            if(checkWidth){
                var update = { _id: vm.widgetId, widgetType: vm.widget.widgetType, pageId: vm.pageId, width: checkWidth, url: url};
                WidgetService.updateWidget(vm.widgetId, update);
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
            }
        }

        function deleteWidget(widgetId){
            WidgetService.deleteWidget(widgetId);
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
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

