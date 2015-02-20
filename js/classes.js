
//********************     main function used for creating my movable mixins    **********************
//Movement isn't just static, it uses velocity which is gained from acceleration, along with friction to slow it down.
//This makes movement more fluid. 
var asMovable = function() {
	this.boundX = [];
	this.boundY = [];

	this.move = function() {
		this.x += this.velX;
		this.y += this.velY;
	}
	
	this.stop = function() {
		this.velX = 0;
		this.velY = 0;
	}
	
	this.stopX = function() {
		this.velX = 0;
	}
	
	this.stopY = function() {
		this.velY = 0;
	}
	
	this.slowFriction = function (x,y) {
		this.velX *= x;
		this.velY *= y;
		if (Math.abs(this.velX) <= .01) {
			this.velX = 0;
		}
		if (Math.abs(this.velY) <= .01) {
			this.velY = 0;
		}
	}
	
	this.applyGravity = function (gravity) {
		this.velY += gravity;
	}
	
	this.position = function() {
		return [this.x,this.y];
	}
	
	this.accelerate = function(x, y) {
		this.velX += x;
		this.velY += y;
		
		if (this.maxXSpeed != -1) {
			if (this.velX > this.maxXSpeed) {
				this.velX = this.maxXSpeed;
			} else if (this.velX < -this.maxXSpeed) {
				this.velX = -this.maxXSpeed;
			}
		}
		
		if (this.maxYSpeed != -1) {
			if (this.velY > this.maxYSpeed) {
				this.velY = this.maxYSpeed;
			} else if (this.velY < -this.maxYSpeed) {
				this.velY = -this.maxYSpeed;
			}
		}
	}
	
	this.checkBounds = function() {	
		var returnArray = [];
		
		if (this.x < 0) {
			returnArray[0] =  0;
		} else if (this.x > (Game.canvas.width - this.width)) {
			returnArray[0] = (Game.canvas.width - this.width);
		} else {
			returnArray[0] = -1;
		}
	
		if (this.y < 0) {
			returnArray[1] = 0;
		} else if (this.y > Game.canvas.height - this.height) {
			returnArray[1] = (Game.canvas.height - this.height);
		} else {
			returnArray[1] = -1;
		}	
		return returnArray;
	}
}; 

var Player = function(x, y, width, height, name, img) {
    this.x = x;
    this.y = y;
	this.width = width;
	this.height = height;
    this.name = name;
	this.velX = 0;
	this.velY = 0;
	this.maxXSpeed = 8;
	this.maxYSpeed = 12;
	this.friction = .8;
	this.acceleration = 3;
	this.img = img;
	
	this.reset = function() {
		this.x = x;
		this.y = y;
		this.velX = 0;
		this.velY = 0;
		this.img.src = img.src;
	}
	
	this.update = function() {
		this.checkKeys();
		this.move();
		this.bounds();		
		Game.draw(this);
	}
	
	this.bounds = function () {
		var check = this.checkBounds();
		if (check[0] != -1) {
			this.x = check[0];
		}
		
		if (check[1] != -1) {
			this.y = check[1];
		}
	}
	
	this.checkKeys = function() {
		//right arrow or d
		if (Game.keys[39] || Game.keys[68]) {
			this.accelerate(this.acceleration,0);
		}
		//left arrow or s
		if (Game.keys[37] || Game.keys[65]) {
			this.accelerate(-this.acceleration,0);
		}
		//up arrow or w
		if (Game.keys[38] || Game.keys[87]) {
			this.accelerate(0,-this.acceleration);
		}
		//down arrow or d
		if (Game.keys[40] || Game.keys[83]) {
			this.accelerate(0,this.acceleration);
		}
		//if not moving left or right, slow using defined friction
		if (!(Game.keys[37] || Game.keys[39] || Game.keys[65] || Game.keys[68])) {
			this.slowFriction(this.friction,1);
		}
		//if not moving left or right, slow using defined friction. Can also be updated to use gravity
		if (!(Game.keys[40] || Game.keys[83] || Game.keys[38] || Game.keys[87])) {
			this.slowFriction(1,this.friction);
		}
		//check for space bar to shoot
		if (Game.keys[32] && Game.projectileCooldown <= 0) {
			Game.spawnProjectile(this);
		}
	}
};

var GoodProjectile = function(obj,width,height,img,velX,velY,audio) {
	this.x = obj.x;
	this.y = obj.y + obj.height / 2;
	this.width = width;
	this.height = height;
	this.img = img
	this.velX = velX;
	this.velY = velY;
	this.maxXSpeed = -1;
	this.maxYSpeed = 1;
	this.audio = new Audio(audio.src);
	this.audio.play();
	
	this.update = function() {
		if (this.x > Game.canvas.width || this.x < 0) {
			Game.projectiles.shift();
			delete(this);
		} else {
			this.move();
			Game.draw(this);
		}
	}
	
	this.getDestroyed = function(index) {
		Game.projectiles.splice(index,1);
		delete(this);
	}
};

var BadProjectile = function(obj,width,height,img,velX,velY,audio) {
	this.x = obj.x;
	this.y = obj.y + obj.height / 2;
	this.width = width;
	this.height = height;
	this.img = img
	this.velX = velX;
	this.velY = velY;
	this.maxXSpeed = -1;
	this.maxYSpeed = 1;
	this.audio = new Audio(audio.src);
	this.audio.play();
	
	this.update = function() {
		if (this.x > Game.canvas.width || this.x < 0) {
			Game.badProjectiles.shift();
			delete(this);
		} else {
			this.move();
			Game.draw(this);
		}
	}
	
	this.getDestroyed = function(index) {
		Game.badProjectiles.splice(index,1);
		delete(this);
	}
};

var Enemy = function(width,height,img,audio) {
	this.width = width;
	this.height = height;
	this.img = img;
	this.x = Game.canvas.width - this.width;
	this.y = Math.random() * (Game.canvas.height - this.height);
	this.velX = 0;
	this.velY = 0;
	this.maxXSpeed = 3;
	this.maxYSpeed = 3;
	this.acceleration = 1;
	this.deathSound = new Audio(audio.src);
	
	this.update = function() {
		if (Math.random() < .5) {
			this.accelerate(0,this.acceleration);
		} else {
			this.accelerate(0,-this.acceleration);
		}
		this.accelerate(-this.acceleration,0);
		this.move();
		this.bounds();
		
		if (Math.random() < .005) {
			Game.spawnBadProjectile(this);
		}
		Game.draw(this);
	}
	
	this.bounds = function() {
		var check = this.checkBounds();
		if (check[0] != -1) {
			Game.enemies.shift();
			delete(this);
		}
		
		if (check[1] != -1) {
			this.y = check[1];
		}
	}
	
	this.getDestroyed = function(index) {
		this.deathSound.play();
		Game.enemies.splice(index,1);
		delete(this);
		Game.score++;
	}
}

//Scrolling background. Gets a starting x and scroll speed. The resetAtX is the point where it is moved back to it's original starting position for infinate scrolling
//The resetXTo is where it resets. This allows for multiple backgrounds for continuity. 
var scrollingBackGround = function(img, width, height, speed, originalX, resetXAt, resetXTo) {
	this.img = img;
	this.width = width;
	this.height = height;
	this.velX = speed;
	this.velY = 0;
	this.x = originalX;
	this.y = 1;
	this.resetXAt = resetXAt;
	this.resetXTo = resetXTo;
	this.update = function() {
		this.move();
		if (this.x <= this.resetXAt) {
			this.x = this.resetXTo;
		}
		Game.draw(this);
	}
}
//Inherit the methods from the asMovable function, creating our mixins
asMovable.call(Player.prototype);
asMovable.call(GoodProjectile.prototype);
asMovable.call(BadProjectile.prototype);
asMovable.call(Enemy.prototype);
asMovable.call(scrollingBackGround.prototype);
