var app = angular.module('listular', []);

//filter from here: 
//http://stackoverflow.com/questions/14198822/angularjs-paging-orderby-only-affects-displayed-page
app.filter('startFrom', function () {
    return function (input, start) {
        if (typeof input != 'undefined' && input != null) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return input;
    };
});

/*These are the default templates for the various parts. 
  Using values so anyone implementing these can change out the templates as they see fit.
*/
app.value('filterTemplate', {
    template: '<div class="filter"><input ng-model="query" ng-show="showFilter" placeholder="Filter"/></div>',
    templateUrl: ''
});


app.value('sortTemplate', {
    template: '<div class="sort" ng-show="showSort"><ul><li ng-repeat="sortItem in sortFields" ng-class="sortClass(sortItem)"><a href="#" ng-click="changeSortField(sortItem)">{{sortItem}}</a></li></ul></div>',
    templateUrl: ''
});

app.value('repeatTemplate', {
    template: '<div ng-repeat="item in filteredData | orderBy:sortField:sortReverse | startFrom:currentPage*pageSize | limitTo:pageSize" class="listrepeat">' +
                       '<div ng-switch on="templateurl">' +
                            '<div ng-switch-when="">{{item}}</div>' +
                            '<div ng-switch-default><div ng-include="templateurl" class="list-row"></div></div>' +
                        '</div>' +
                    '</div>',
    templateUrl: ''
});

app.value('nextPreviousTemplate', {
    template: '<div ng-show="showNextPrevious" class="paging">' +
                            '<button ng-click="first()">&lt;&lt;</button>' +
                            '<button ng-click="prev()">&lt;</button>' +
                            '<select ng-model="pageSize" ng-show="showPageSize">' +
                                '<option>3</option>' +
                                '<option>5</option>' +
                                '<option>8</option>' +
                            '</select>' +
                            '<button ng-click="next()">&gt;</button>' +
                            '<button ng-click="last()">&gt;&gt;</button>' +
                         '</div>',
    templateUrl: ''
});

app.factory('templates',['filterTemplate', 'sortTemplate', 'repeatTemplate', 'nextPreviousTemplate', function(filterTemplate, sortTemplate, repeatTemplate, nextPreviousTemplate){
    var getTemplate = function(item){
        return item.templateUrl !=  "" ? "<div ng-include='" + item.templateUrl + "'></div> " : item.template; 
    }

    return {
       getTemplates: function(){
           return getTemplate(filterTemplate) + getTemplate(sortTemplate) + getTemplate(repeatTemplate) + getTemplate(nextPreviousTemplate);
        }
    };

}]);

app.directive('list', ['$filter', 'templates', function ($filter, templates) {
    return {
        template: templates.getTemplates(),
        link: function (scope, elem, attrs) {
            //defaults
            scope.templateurl = "";
            scope.currentPage = 0;
            scope.pageSize = 3;
            scope.query = "";
            scope.showNextPrevious = true;
            scope.showPageSize = true;
            scope.showFilter = true;
            scope.showSort = true;
            scope.sortField = "name";
            scope.sortReverse = false;

            if ('undefined' != typeof attrs["data"]) {
                //do something to make it so we can pass this in on scope as well
                scope.data = window[attrs["data"]].data;
                scope.filteredData = scope.data;
                scope.sortFields = window[attrs["data"]].sortFields;
                scope.templateUrl = window[attrs["data"]].templateUrl || "";
                scope.showPageSize = window[attrs["data"]].showPageSize || scope.showPageSize; 
                scope.showNextPrevious = window[attrs["data"]].showNextPrevious || scope.showNextPrevious; 
                scope.showFilter = window[attrs["data"]].showFilter || scope.showFilter; 
                scope.showSort = window[attrs["data"]].showSort || scope.showSort; 
                scope.sortField = window[attrs["data"]].sortField || scope.sortField; 
            }

            if ('undefined' != typeof attrs["templateurl"]) {
                scope.templateurl = attrs["templateurl"];
            }

            if ('undefined' != typeof attrs["showPageSize"]) {
                scope.showPageSize = attrs["showPageSize"] == "true";
            }

            if ('undefined' != typeof attrs["showNextPrevious"]) {
                scope.showNextPrevious = attrs["showNextPrevious"] == "true";
            }

            if ('undefined' != typeof attrs["showFilter"]) {
                scope.showFilter = attrs["showFilter"] == "true";
            }

            if ('undefined' != typeof attrs["showSort"]) {
                scope.showSort = attrs["showSort"] == "true";
            }

            if ('undefined' != typeof attrs["defaultSort"]) {
                scope.sortField = attrs["defaultSort"];
            }


            scope.numberOfPages = function () {
                return Math.ceil(scope.filteredData.length / scope.pageSize);
            };

            scope.changeSortField = function (item) {
                if (item == null) return; 
                if (scope.sortField == item) {
                    scope.sortReverse = !scope.sortReverse;
                }

                scope.sortField = item;
            };

            scope.sortClass = function(item) {
                return item == scope.sortField ?
                    scope.sortReverse == true ? "selected reverse" : "selected"
                    : "";
            };

            scope.first = function () {
                scope.currentPage = 0;
            };

            scope.last = function () {
                scope.currentPage = scope.numberOfPages() - 1;
            };

            scope.prev = function () {
                scope.currentPage = scope.currentPage == 0 ? 0 : scope.currentPage - 1;
            };

            scope.next = function () {
                scope.currentPage = scope.currentPage == scope.numberOfPages() - 1 ? scope.currentPage : scope.currentPage + 1;
            };

            //go to page 1 when filtering
            scope.$watch('query', function (val, orig) {
                scope.currentPage = 0;
                scope.filteredData = $filter("filter")(scope.data, scope.query);
            });

            //make sure we don't go outside of max pages
            //also eventually want to make this not happen as a watch for performance
            scope.$watch('numberOfPages()', function (val, orig) {
                if (scope.currentPage >= scope.numberOfPages()) {
                    scope.currentPage = scope.numberOfPages() - 1;
                }
            });
        }
    };
}]);