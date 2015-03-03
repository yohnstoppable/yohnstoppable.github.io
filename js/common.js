//Holder for common game functions like math and collision detection

Common = {
	//calculates the speed of x and y according to the speed and how far to the side and up/down a target is
	getRiseRun : function(obj,target,speed) {
		var projectileSpeed = speed;
		var offsetX = 0;
		var offsetX2 = 0;
		var offsetY = 0;
		var offsetY2 = 0;
		if (typeof(target.width) != "undefined") {
			var offsetX = target.width;
		}
		
		if (typeof(obj.width) != "undefined") {
			var offsetX2 = obj.width;
		}
		
		if (typeof(target.height) != "undefined") {
			var offsetY = target.height;
		}
		
		if (typeof(obj.height) != "undefined") {
			var offsetY2 = obj.height;
		}
		
		var rise = target.y - obj.y + (offsetY/2) - (offsetY2/2);
		var run = target.x - obj.x + (offsetX/2) - (offsetY2/2);
		
		var hyp = Math.sqrt(Math.pow(run,2) + Math.pow(rise,2));
		
		rise *= (projectileSpeed/hyp);
		run *= (projectileSpeed/hyp);
		
		return {
			x : run,
			y : rise
		};
	},
	
	//Simple collision check between two objects. Will rework if/when more complex objects are created
	checkCollision : function(obj1, obj2) {
		var xRange = false;
		var yRange = false;
		
		//checks for x collision. If there is one, then check for y next. 
		if (((obj1.x >= obj2.x) && (obj1.x <= (obj2.x + obj2.width))) || (((obj1.x + obj1.width) >= obj2.x) && ((obj1.x + obj1.width) <= (obj2.x + obj2.width)))) {
			xRange = true;
			if (((obj1.y > obj2.y) && (obj1.y < (obj2.y + obj2.height))) || (((obj1.y + obj1.height) >= obj2.y) && ((obj1.y + obj1.height) <= (obj2.y + obj2.height)))) {
				yRange = true;
			}
		}
		
		return (xRange && yRange);
	},
	
	//********** Draw Game Objects **********
	draw : function (obj) {
		try {
			Game.ctx.drawImage(obj.img, obj.x, obj.y,obj.width,obj.height);
		} catch (e) {
			console.trace();
			console.log(obj.img.src);
			console.log(obj.x);
			console.log(obj.y);
			console.log(obj.width);
			console.log(obj.height);
		}
	},
	
	drawRotated : function(obj) {
		// save the context's co-ordinate system
		Game.ctx.save(); 
 
		// move the origin to object   
		Game.ctx.translate(obj.x, obj.y); 
 
		// now move across and down half the width and height of the object
		Game.ctx.translate(obj.width/2, obj.height/2); 
 
		// rotate around this point
		Game.ctx.rotate(obj.angle); 
 
		// then draw the image back and up
		Game.ctx.drawImage(obj.img, -(obj.width/2), -(obj.height/2),obj.width,obj.height);
 
		// and restore the co-ordinate system to its default
		Game.ctx.restore();
	}
}