Listular
========

**Listular** is an AngularJS directive that takes an array of data and renders it as a paged / sorted / filtered ng-repeat. 

*This is very much a work in progress -- any feedback would be appreciated!*

Say you have an array of data:
 
```
  {name: 'Satya Nadella', company: 'Microsoft'},
  {name: 'Shantanu Narayen', company: "Adobe Systems"},
  {name: 'Jeff Bezos', company: 'Amazon'},
  {name: 'Rory Read', company: 'AMD'},
```

And you want to render this list in a typical `ng-repeat` but you also want paging/sorting/filtering... That's where **listular** comes in! 

 

## Usage ##
1. Add listular.js as a reference to your project `<script src="listular.js"></script>`
2. Inject into your angular app `var app = angular.module('app', ['listular']);` 
3. Create JavaScript object with Listular properties and data array `var listProperties = { data: [...], sortFields:[...]};`
4. Add listular directive to your page `var app = angular.module('app', ['listular']);`

##Customization##

There are a number of options for customizing Listular (most of which can be passed in via attributes on the html or properties in the JavaScript object)


* *templateurl* - The url of the main template for displaying the data
* *showPageSize* - When true (default) shows a select box with the amount of results to show per page
* *showNextPrevious* - When true (default) shows the next / previous / first / last buttons 
* *showFilter* - When true (default) shows an input box above the list of data for filtering the data
* *showSort* - When true (default) shows the available sort options

In addition to the properties you can override the various parts of listular with your own template definitions by overriding the default value.

```
app.value('filterTemplate', {
    template: '<h2>Add header text for some reasonx</h2><div class="filter"><input ng-model="query" ng-show="showFilter" placeholder="Filter"/></div>',
    templateUrl: ''
});
```

###Styling###
There is no default style with Listular. You define the styles of listular to match your site. There are four css classes that correspond to the various parts of Listular

1. *.filter* - The class that corresponds to the filter section
2. *.sort* - The class that corresponds to the sorting properties. When a sort item selected it gets a class of `selected` applied to the list element, as well as whether or not the sorting is reversed (You can add pseudo-elements to give a visual indication as to which direction the sort is occurring -- check out the styles in the example to see this in action).
3. *.listrepeat* - The class that corresponds to the repeat section
4. *.paging* - The class that corresponds to the paging area at the bottom of the list

##Example Usage##

```
<style>
	.sort li.selected:after{
		content: '˄';
	}

	.sort li.selected.reverse:after{
		content: '˅';
	}
</style>
<script type="text/javascript">
	var listProperties = {
		data: [
	      {name: 'Satya Nadella', company: 'Microsoft'},
	      {name: 'Shantanu Narayen', company: "Adobe Systems"},
	      {name: 'Jeff Bezos', company: 'Amazon'},
	      {name: 'Rory Read', company: 'AMD'},
	      {name:'Steven Elop', company: 'Nokia'},
	      {name:'Alan Mulally', company: 'Ford'},
	      {name:'Tim Cook', company: 'Apple'},
	      {name:'Michael Dell', company: 'Dell'},
	      {name:'Mark Zuckerberg', company: 'Facebook'},
	      {name:'Mikael Ohlsson', company: 'IKEA'},
	      {name:'Paul Otellini', company: 'Intel'},
	      {name:'Mitchell Baker', company: 'Mozilla'},
	      {name:'Satoru Iwata', company: 'Nintendo'},
	      {name:'Larry Ellison', company: 'Oracle'},
	      {name:'Howard Schultz', company: 'Starbucks'},
	      {name:'Gabe Newell', company: 'Valve'},
	    ],
	     sortFields: ['name', 'company'],
	     templateUrl: "template/person.html",
	     showFilter: true,
	     showNextPrevious: true,
	     showPageSize: true 
	};	
</script>
...
<body>
	<div list properties="listProperties"></div>
</body>

```

It's also possible to pass the data from a standard ng-controller instead of the properties object (you can still pass in a properties object for everything else). 

```
	var app = angular.module('app', ['listular']);
	
	app.controller('testCtrl', ['$scope', function($scope){
		$scope.listData = [
      {name: 'Satya Nadella', company: 'Microsoft'},
      {name:'Michael Dell', company: 'Dell'},
      {name:'Mark Zuckerberg', company: 'Facebook'},
      {name:'Mikael Ohlsson', company: 'IKEA'}];
	}]);
```

```
	<div list data="listData" properties="listProperties"></div>
```

##Roadmap##
1. Unit tests
1. Show page number
1. Infinite scroll
