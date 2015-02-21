
//********************     main function used for creating my movable mixins    **********************
//Movement isn't just static, it uses velocity which is gained from acceleration, along with friction to slow it down.
//This makes movement more fluid. 
var asMovable = function() {

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

//Player object. Gets combined with movable and also contains it's own functionality. check keys might be moved in the future. 
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
			Game.spawnProjectile(this,Game.mousePosition,15);
		}		
		if (Game.keys[81] && Game.specialCooldown <= 0) { 
			Game.spawnSpecial(this,Game.mousePosition,15);
		}
	}
};
asMovable.call(Player.prototype);

//Definiting my projectile items. 
var Projectile = function(obj,width,height,img,velX,velY,audio,rotated) {
	this.x = obj.x;
	this.y = obj.y + obj.height / 2;
	this.width = width;
	this.height = height;
	this.img = img;
	this.velX = velX;
	this.velY = velY;
	this.maxXSpeed = -1;
	this.maxYSpeed = 1;
	this.audio = new Audio(audio.src);
	this.audio.play();
	this.rotated = rotated;
	
	this.update = function(gameArray,index) {
		if (this.bounds(gameArray,index)) {
			return;
		} else {
			this.move();
			if (this.rotated === 0) {
				Game.draw(this);
			} else {
				Game.drawRotated(this);
			}
		}
	}
	
	this.getDestroyed = function(gameArray,index) {
		gameArray.splice(index,1);
		delete(this);
	}
	
	this.bounds = function(gameArray,index) {
		var check = this.checkBounds();
		if (check[0] != -1) {
			this.getDestroyed(gameArray,index);
			return true;
		} else {
			return false;
		}
	}
};
asMovable.call(Projectile.prototype);

//Enemy logic. Will probably be seperated out when more enemy types come into play. Soon to add health and other projectile spawning.
var Enemy = function(width,height,img,audio,health) {
	this.width = width;
	this.height = height;
	this.img = img;
	this.x = Game.canvas.width - this.width;
	this.y = Math.random() * (Game.canvas.height - this.height);
	this.velX = 0;
	this.velY = 0;
	this.maxXSpeed = 3;
	this.maxYSpeed = 3;
	this.health = health;
	this.accelerationX = 1;
	this.accelerationY = 1;
	this.shotChance = .005;
	this.deathSound = new Audio(audio.src);
	this.points = 1;
	
	this.update = function() {
		if (Math.random() < .5) {
			this.accelerate(0,this.accelerationY);
		} else {
			this.accelerate(0,-this.accelerationY);
		}
		this.accelerate(-this.accelerationX,0);
		this.move();
		this.bounds();
		
		if (Math.random() < this.shotChance) {
			Game.spawnBadProjectile(this,Game.player1,15);
		}
		Game.draw(this);
	}
	
	this.bounds = function() {
		var check = this.checkBounds();
		if (check[0] != -1) {
			this.accelerationX *= -3;
			this.maxXSpeed = 6;
			this.maxYSpeed = 6;
			this.shotChance *= 50;
			this.x  -= (this.accelerationX*3);
		}
		
		if (check[1] != -1) {
			this.y = check[1];
		}
	}
	
	this.getDamaged = function(index,dmg) {
		this.health -= dmg;
		if (this.health <= 0) {
			this.deathSound.play();
			Game.enemies.splice(index,1);
			delete(this);
			Game.score+= this.points;
		}
	}
}
asMovable.call(Enemy.prototype);

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
asMovable.call(scrollingBackGround.prototype);