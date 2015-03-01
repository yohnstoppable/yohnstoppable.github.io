//********************     main function used for creating my movable mixins    **********************
//Movement isn't just static, it uses velocity which is gained from acceleration, along with friction to slow it down.
//This makes movement more fluid. 
var asMovable = function() {
	this.velX = 0;
	this.velY = 0;
	this.acceleration = 0;
	this.hasGravity = false;
	this.gravity = .6;
	this.angle = 0;
	this.health = 1;
	this.points = 0;

	this.move = function() {
		if (this.hasGravity) {
			this.velY += this.gravity;
		}
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
	
	this.position = function() {
		return {
			x: this.x,
			y: this.y
		};
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
	
	this.checkBounds = function(leewayX,leewayY) {	
		leewayX = typeof leewayX !== 'undefined' ? leewayX : 0;
		leewayY = typeof leewayY !== 'undefined' ? leewayY : 0;
		var returnArray = [];
		
		if (this.x+leewayX < 0) {
			returnArray[0] =  0;
		} else if (this.x - leewayX > (Game.canvas.width - this.width)) {
			returnArray[0] = (Game.canvas.width - this.width);
		} else {
			returnArray[0] = -1;
		}
	
		if (this.y + leewayY < 0) {
			returnArray[1] = 0;
		} else if (this.y - leewayY > Game.canvas.height - this.height) {
			returnArray[1] = (Game.canvas.height - this.height);
		} else {
			returnArray[1] = -1;
		}	
		return returnArray;
	}
	
	this.draw = function(rotate) {
		this.angle = (Math.atan2(this.velY, this.velX));
		rotate = typeof rotate !== 'undefined' ? rotate : false;
		if (this.angle != 0 && rotate) {
			Game.drawRotated(this);
		} else {
			Game.draw(this);
		}
	}
	
	this.getDamaged = function(array,index,dmg) {
		this.health -= dmg;
		if (this.health <= 0) {
			if (typeof this.deathSound !== 'undefined') {
				//this.deathSound.play();
				createjs.Sound.play(this.deathSound);
			}
			array.splice(index,1);
			delete(this);
			Game.score += this.points;
		}
	}
}; 

//Player object. Gets combined with movable and also contains it's own functionality. check keys might be moved in the future. 
var Player = function(x, y, width, height, name, img) {
    this.x = x;
    this.y = y;
	this.width = width;
	this.height = height;
    this.name = name;
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
		this.checkTouch();
		this.move();
		this.bounds();		
		this.draw();
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
		if (Game.keys[32]) {
			Game.spawnProjectile(this,Game.mousePosition,10);
		}		
		if (Game.keys[81] && Game.specialCooldown <= 0) { 
			Game.spawnSpecial(this,Game.mousePosition,10);
		}
	}
	
	this.checkTouch = function() {
		if (Game.touchesInAction.length != 0) {
			for (var i=0; i < Game.touchesInAction.length; i++) {
				if (Game.touchesInAction[i].x < Game.canvas.width/8) {
					if (Game.touchesInAction[i].y - this.acceleration - this.height > this.y) {
						this.accelerate(0,this.acceleration);
					} else if (Game.touchesInAction[i].x +12 < this.y) {
						this.accelerate(0,-this.acceleration);
					}
				} else if (Game.touchesInAction[i].x > Game.canvas.width * (1/2)) {
					Game.spawnProjectile(this,Game.touchesInAction[i],10);
				}
			}
		}
	}
};
asMovable.call(Player.prototype);

//Definiting my projectile items. 
var Projectile = function(obj,width,height,img,velX,velY,audio) {
	this.x = obj.x + obj.width/2;
	this.y = obj.y + obj.height / 2;
	this.width = width;
	this.height = height;
	this.img = img;
	this.velX = velX;
	this.velY = velY;
	this.maxXSpeed = -1;
	this.maxYSpeed = 1;
	this.audio = audio;
	createjs.Sound.play(this.audio);
	//this.audio = new Audio(audio.src);
	//this.audio.play();
	
	this.update = function(gameArray,index) {
		if (this.bounds(gameArray,index)) {
			return;
		} else {
			this.move();
			this.draw(true);
		}
	}
	
	this.bounds = function(gameArray,index) {
		var check = this.checkBounds(this.width,this.height);
		if (check[0] != -1 || check[1] != -1) {
			this.getDamaged(gameArray,index,this.health);
			return true;
		} else {
			return false;
		}
	}
};
asMovable.call(Projectile.prototype);

//Enemy logic. Will probably be seperated out when more enemy types come into play. 
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
	this.shotChance = .015;
	this.deathSound = audio;
	//this.deathSound = new Audio(audio.src);
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
			Game.spawnBadProjectile(this,Game.player1,8);
		}
		this.draw();
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
		this.draw();
	}
}
asMovable.call(scrollingBackGround.prototype);