(function(){
	var app = angular.module('newNative', []);
		
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
	
	app.controller("master", function($http){		
		this.results = results;
		console.log(results);
		
		this.section = "Furniture";
		
		this.clicked = function(menuItem) {
			this.section = menuItem;
		}
		
		this.details = function(header,img,description,url) {
			swal({
				title: header,
				text: "<a href=" + url + "><img class='modalImage' src='" + img + "'></a><br><br>" + description.replace(/(?:\r\n|\r|\n)/g, '<br />'),
				html: true,
				backgroundColor: "#cccc99",
				confirmButtonColor: "#70909E",
				allowOutsideClick:"true"
			});
		}
	});

	var menuItems = ["HOME","TIES","COATS","SHOES","BIO"];	
	var sections = [];
	var section = "ties";			
})();