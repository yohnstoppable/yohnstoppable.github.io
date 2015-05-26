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

		$scope.resultsByCategory = sort(results);
		console.log($scope.resultsByCategory);

		$scope.section = "Home";
		$scope.title = "Home";
		$scope.story = about;
		
		$scope.clicked = function(menuItem) {
			if ($scope.section !== menuItem) {
				$scope.section = "";
				$scope.menuItem = menuItem;				
				$timeout($scope.change,199);
			}
		}
		
		$scope.change = function() {
			$scope.title = $scope.menuItem;
			$scope.section = $scope.menuItem;
		}
		
		$scope.details = function(dees,header,img,description,url) {
		}
	});

	var sections = [];		
})();