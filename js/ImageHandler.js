var ImageHandler = function() {
	var imageArray = [];
	var transitionArray = [];
	var currentType = 0;
	var transitioning = false;
	var last = -1;
	var current = 0;
	var loop = 0;
	var handle = 0;
	var clickedType = 0;
	
	this.loadImages = function(type) {
		var newImageArray = [];
		var newTransitionArray = [];
		if (imageArray.length !== 0 && currentType !== type && !transitioning) {
			currentType = type;
			transitioning = true
			$(imageArray[current]).fadeOut(500);
			current = 0;
			$("#test").find("img." + type).each(function(index,value){
				newTransitionArray.push(value);
			});
			transitionArray = newTransitionArray;
		} else if (imageArray.length === 0) {
			currentType = type;
			$("#test").find("img").each(function(index,value){
				$(value).hide();
			});
			$("#test").find("img." + type).each(function(index,value){
				if (index === 0) {
					$(value).fadeIn(500);
				}
				newImageArray.push(value);
			});
			imageArray = newImageArray;
			handle = setInterval(this.imageSifter, 250);
		} 
	}
	
	this.imageSifter = function() {		
		last = current;
		if (transitioning) {
			current = 0;
			imageArray = transitionArray;
			$(imageArray[0]).fadeIn(500);
			transitioning = false;
			loop = 0;
		} else if (loop === 8) {
			current++;
			
			if (current === imageArray.length) {
				current = 0;
			}
			
			$(imageArray[current]).fadeIn(1000);
			$(imageArray[last]).fadeOut(1000);
			loop = 0;
		}
		loop++;
	}
	
	this.getCurrent = function() {
		return current;
	}
	
	this.setCurrent = function(newCurrent) {
		current = newCurrent;
	}
	
	this.getLast = function() {
		return last;
	}
	
	this.setLast = function(newLast) {
		last = newLast;
	}
	
	this.getLoop = function() {
		return loop;
	}
	
	this.setLoop = function(newLoop) {
		loop = newLoop;
	}
	
	this.getImageArray = function() {
		return imageArray;
	}
	
	this.setImageArray = function(newImageArray) {
		imageArray = newImageArray;
	}
	
	this.getHandle = function() {
		return handle;
	}
	
	this.setHandle = function() {
		handle = handle;
	}
	
	this.getClickedType = function() {
		return clickedType;
	}
	
	this.setClickedType = function(newClickedType) {
		clickedType = newClickedType;
	}
}