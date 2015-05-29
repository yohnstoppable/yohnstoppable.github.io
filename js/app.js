(function(){
	var app = angular.module('newNative', ['ngAnimate']);
		
	app.controller("menuController",function() {
		this.menuItems = [];
		this.menuItems.push("Home");
		for (var i=0; i < results.length; i++) {
			if (this.menuItems.indexOf(results[i].category_path[0]) === -1) {
				this.menuItems.push(results[i].category_path[0]);
			}
		}	
		this.menuItems.push("Bio");
	});
	
	app.filter('fixText', function() {
	  return function(input) { 
		input = input.replace(/&#39;/g, "'");
		input = input.replace(/&quot;/g, '"');
		return input;
	  }
	});
	
	app.filter('commaList', function() {
		return function(input) { 
			var myResults = "";
			for (var i=0; i < myResults.length; i++) {
				if (myResults[i].materials.length > 0) {
					myResults[i].materialString = "Materials: " 
					for (var n=0; n < myResults[i].materials.length; n++) {
						myResults[i].materialString += myResults[i].materials[n];
						if (n < myResults[i].materials.length-1) {
							myResults[i].materialString += ", ";
						}
					}
				}
			}
			return myResults;
		}
	});
	
	app.controller("imageController", function() {
		this.items = items;
	});
	
	app.controller("master", function($scope, $timeout){		
		var sort = function(myResults) {
			var categories = [];
			var returnArray = [];
			var chunkSize = 2;
			
			for (var i=0; i< myResults.length; i++) {
				if (categories.indexOf(myResults[i].category_path[0]) === -1) {
					categories.push(myResults[i].category_path[0]);
				}
			}
			
			for (var i=0; i < myResults.length-1; i++) {
				if (myResults[i].listing_id === 231548329) {
					console.log("blah");
					var temp = myResults[i];
					myResults.splice(i,1);
					myResults.unshift(temp);
				}
			}
			
			return byCategory(categories,myResults);
		}
		
		var byCategory = function(categories,results) {
			var returnArray = [];
			var sorted = [];
			
			for (var n=0; n < categories.length; n++) {
				for (var i=0; i< results.length; i++) {
					if (results[i].category_path[0] === categories[n]) {
						sorted.push(results[i]);
					}
				}
				if (sorted.length > 0) {
					returnArray.push(sorted);
					sorted = [];
				}
			}
			return returnArray;
		}
		
		var getSplash = function(myResults) {
			var splash = [];
			var temp;
			for (var i=0; i < myResults.length; i++) {
				temp = {
					image: myResults[i].MainImage.url_570xN,
					title: myResults[i].title,
					url: myResults[i].url
				}
				splash.push(temp);
			}
			return splash;
		}
		
		$scope.mainSplash = getSplash(results);		
		$scope.resultsByCategory = sort(results);

		$scope.section = "Home";
		$scope.title = "Home";
		$scope.story = about;
		$scope.bioImage = results[0].MainImage.url_570xN
		
		$scope.clicked = function(menuItem) {
			if ($scope.section !== menuItem) {
				$scope.section = "";
				$scope.menuItem = menuItem;				
				$timeout($scope.change,99);
			}
		}
		
		$scope.change = function() {
			$scope.title = $scope.menuItem;
			$scope.section = $scope.menuItem;
			if ($scope.section === "Home") {
				$timeout(initializeSlider,1);
			}
		}
		
		$scope.details = function(dees,header,img,description,url) {
		}
	});

	var sections = [];		
})();