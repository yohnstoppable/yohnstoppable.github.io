(function(){
	"use strict";
	
	var app = angular.module('newNative', ['ngAnimate']);
	
	//******************** Services ********************//	
	//Service to share common items between controllers. 
	app.service('sharedProperties', function () {
        var results = "";
		var story = "";
		var section = "Home";
        return {
            getResults: function () {
                return results;
            },
            setResults: function(value) {
                results = value;
            },
			getStory: function () {
				return story;
			},
			setStory: function(value) {
				story = value;
			},
			getSection: function () {
                return section;
            },
            setSection: function(value) {
                section = value;
            },
			initializeSlider: function() {
				var imgSlider = new SimpleSlider(
					document.getElementById('myslider'), {
						autoPlay:true,
						transitionProperty:'opacity',
						startValue: 0,
						visibleValue: 1,
						endValue: 0
					}
				);
			}
        };
    });
	
	
	//******************** Custom Directives ********************//	
	//header panel
	app.directive("headerPanel", function() {
		return {
			restrict: "E",
			templateUrl: "templates/header-panel-template.html",
		}
	});
	
	//Menu Panel
	app.directive("menuPanel",function() {
		return {
			restrict: "E",
			templateUrl: "templates/menu-panel-template.html",
			controller: function($timeout,sharedProperties,$scope) {
				//build menu
				this.menuItems = [];
				this.menuItems.push("Home");
				var results = sharedProperties.getResults();
				
				for (var i=0; i < results.length; i++) {
					if (this.menuItems.indexOf(results[i].category_path[0]) === -1) {
						this.menuItems.push(results[i].category_path[0]);
					}
				}	
				this.menuItems.push("Bio");
				
				//slightly delays changing the section for a quick fade of the current item.
				$scope.clicked = function(menuItem) {
					if (sharedProperties.getSection() !== menuItem) {
						sharedProperties.setSection("");
						$timeout(function() {
							sharedProperties.setSection(menuItem);
							if (sharedProperties.getSection() === "Home") {
								//even a timeout of 0 will still delay until loaded so the home page slider will initialize properly
								$timeout(sharedProperties.initializeSlider,0);
							}
						},100);
					}
				}
			},
			controllerAs: "menuCtrl"
		}
	});
	
	//Home panel directive. Gets story information for image slider
	app.directive("homePanel",function() {
		return {
			restrict: "E",
			templateUrl: "templates/home-panel-template.html",
			controller: function(sharedProperties,$scope,$timeout) {
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
				$scope.mainSplash = getSplash(sharedProperties.getResults());
				$(window).load(function() {
					$timeout(sharedProperties.initializeSlider,0);
				});
			},
			controllerAs: "homeController"
		}
	});
	
	//results for the content pane
	app.directive("resultsPanel", function() {
		return {
			restrict: "E",
			templateUrl: "templates/results-panel-template.html",
			controller: function($scope, sharedProperties) {
				//along with byCategory(), separates results into array of arrays (each array is results of different category)
				var sort = function(myResults) {
					var categories = [];
					var returnArray = [];
					var chunkSize = 2;
					
					for (var i=0; i< myResults.length; i++) {
						if (categories.indexOf(myResults[i].category_path[0]) === -1) {
							categories.push(myResults[i].category_path[0]);
						}
					}
					
					//TODO: not hard coding item to go first on list of results
					for (var i=0; i < myResults.length-1; i++) {
						if (myResults[i].listing_id === 231548329) {
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
				
				$scope.resultsByCategory = sort(Common.results);
				$scope.section = sharedProperties.getSection;
			}, controllerAs: "resultsCtrl"
		}
	});
	
	//Bio panel. Mostly uses story information
	app.directive("bioPanel", function() {
		return {
			restrict: "E",
			templateUrl: "templates/bio-panel-template.html",
			controller: function($scope,sharedProperties) {
				$scope.story = sharedProperties.getStory();
				$scope.bioImage = sharedProperties.getResults()[0].MainImage.url_570xN;
			},
			controllerAs: "bioCtrl"
		}
	});
	
	
	//******************** Filters ********************//		
	//Fixes the ascii that gets through from etsy
	app.filter('fixText', function() {
	  return function(input) { 
		input = input.replace(/&#39;/g, "'");
		input = input.replace(/&quot;/g, '"');
		return input;
	  }
	});
	
	
	//******************** Controllers ********************//		
	//Main controller. For now just sets the results and story for the results and bio sections
	app.controller("master", function($scope, $timeout, sharedProperties){		
		sharedProperties.setResults(Common.results);
		sharedProperties.setStory(Common.about);
	});
})();