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
			console.log(myResults);
			var categories = [];
			var sorted = [];
			var returnArray = [];
			for (var i=0; i< myResults.length; i++) {
				console.log(categories.indexOf(myResults[i].category_path[0]));
				if (categories.indexOf(myResults[i].category_path[0]) === -1) {
					categories.push(myResults[i].category_path[0]);
				}
			}

			for (var n=0; n < categories.length; n++) {
				for (var i=0; i< myResults.length; i++) {
					if (myResults[i].category_path[0] === categories[n]) {
						sorted.push(myResults[i]);
					}
					if (sorted.length === 2) {
						returnArray.push(sorted);
						sorted = [];
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

		$scope.section = "Furniture";
		$scope.title = "Furniture";
		
		$scope.clicked = function(menuItem) {
			if ($scope.section !== menuItem) {
				$scope.section = "";
				$scope.menuItem = menuItem;
				$scope.title = menuItem;
				
				$timeout($scope.change,701);
			}
		}
		
		$scope.change = function() {
			$scope.section = $scope.menuItem;
			console.log($scope.section);
		}
		
		$scope.details = function(dees,header,img,description,url) {
		}
	});

	var menuItems = ["HOME","TIES","COATS","SHOES","BIO"];	
	var sections = [];		
})();