(function(){
	var app = angular.module('newNative', []);
		
	app.controller("menuController",function() {
		this.menuItems = ["HOME","TIES","COATS","SHOES","BIO"];
		this.images = images;
		this.section = "coats";
		
		this.clicked = function(menuItem) {
			this.section = menuItem;
		}
		
		this.sectionType = function(image) {
			return image.substring(0, str.length - 1);
		}
	});
	
	app.controller("imageController", function() {
		this.items = items;
	});

	var menuItems = ["HOME","TIES","COATS","SHOES","BIO"];	
	var images = ["tie1","tie2","tie3","tie4","tie5","tie6","coat1","coat2","coat3","shoes1","shoes2","shoes3"];
	var items = [{
		title: "Tie 1",
		section: "ties",
		description: "Robert Downey Jr is one sexy mother fucker. I always forget that he was the guy in Weird Science who pantsed the two main guys at the start. That was a dick move. Also, Kiss Kiss Bang Bang is an awesome movie",
		imageUrl: "images/tie1.jpg"
	}, {
		title: "Tie 2",
		section: "ties",
		description: "Gerard Butler is a little nancy boy who has to ask permission to use the restroom. He tried to fight me over using the blue play doh, but I whooped his ass",
		imageUrl: "images/tie2.jpg"
	}, {
		title: "Tie 3",
		section: "ties",
		description: "I don't even know who this mother fucker is. I bet he has sex with his socks on like a goober",
		imageUrl: "images/tie3.jpg"
	}
	]
})();