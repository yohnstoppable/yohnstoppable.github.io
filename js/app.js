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
		$scope.results = results;
		
		$scope.section = "Furniture";
		$scope.title = "Furniture";
		
		$scope.clicked = function(menuItem) {
			if ($scope.section !== menuItem) {
				$scope.section = "";
				$scope.menuItem = menuItem;
				$scope.title = menuItem;
				
				$timeout($scope.change,401);
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