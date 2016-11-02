(function(){
    angular
        .module("wamDirectives", [])
        .directive("wamSortable", wamSortable);

    function wamSortable(){
        console.log("Hello from Sortable!");
    }
})();