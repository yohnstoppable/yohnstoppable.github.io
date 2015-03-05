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
	this.drop = false;

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
		if (this.velX < 0) {
			this.angle -= (Math.PI);
		}
		rotate = typeof rotate !== 'undefined' ? rotate : false;
		if (this.angle != 0 && rotate) {
			Common.drawRotated(this);
		} else {
			Common.draw(this);
		}
	}
	
	this.damage = function(array,index,dmg) {
		this.health -= dmg;
	}
	
	this.kill = function(array, index) {
		if (typeof this.deathSound !== 'undefined') {
			createjs.Sound.play(this.deathSound,createjs.Sound.INTERRUPT_ANY);
		}
		
		if (this.drop) {
			Stage.spawnSpecial(this.x, this.y);
		}
		array.splice(index,1);
		delete(this);
		Game.score += this.points;
	}
}; 

//Player object. Gets combined with movable and also contains it's own functionality. check keys might be moved in the future. 
var Player = function(x, y, width, height, name, imgLeft,imgRight) {
    this.x = x;
    this.y = y;
	this.width = width;
	this.height = height;
    this.name = name;
	this.maxXSpeed = 8;
	this.maxYSpeed = 12;
	this.friction = .8;
	this.acceleration = 3;
	this.imgLeft = imgLeft;
	this.imgRight = imgRight;
	this.img = imgRight;
	this.weapon = new spread();
	this.special = new blaster();
	
	this.reset = function() {
		this.x = x;
		this.y = y;
		this.velX = 0;
		this.velY = 0;
		this.img = this.imageRight;
		this.equip(new defaultGun());
	}
	
	this.update = function() {
		this.checkKeys();
		this.checkTouch();
		this.updateWeapons();
		this.direction();
		this.move();
		this.bounds();		
		this.draw(true);
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
			this.weapon.shoot(this,Game.mousePosition,true);
			
			if (this.weapon.bullets === 0) {
				this.equip(new defaultGun());
			}
		}		
		if (Game.keys[81]) { 
			this.special.shoot(this,Game.mousePosition,true);
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
	
	this.equip = function(weapon) {
		if (weapon === "special") {
			this.special.cooldown -= 5;
			this.special.health+= .5;
			this.special.bulletSpeed += .5;
			this.special.width++;
			this.special.height++;
		} else {
			this.weapon = weapon;
		}
	}
	
	this.equipSpecial = function(special) {
		this.special = special;
	}
	
	this.updateWeapons = function() {
		if (this.weapon.currentCooldown > 0) {
			this.weapon.currentCooldown--;
		}
		
		if (this.special.currentCooldown > 0) {
			this.special.currentCooldown--;
		}
	}
	
	this.direction = function() {
		if (this.velX < 0) {
			this.img = this.imgLeft;
		}	else {
			this.img = this.imgRight;
		}
	}
	
};
asMovable.call(Player.prototype);

//Definiting my projectile items. 
var Projectile = function(obj,weapon) {
	this.x = obj.x + obj.width/2;
	this.y = obj.y + obj.height / 2;
	this.width = weapon.width;
	this.height = weapon.height;
	this.img = weapon.img;
	this.velX = weapon.speed.x;
	this.velY = weapon.speed.y;
	this.maxXSpeed = -1;
	this.maxYSpeed = 1;
	this.health = weapon.health;
	this.audio = weapon.spawnSound;
	createjs.Sound.play(this.audio,createjs.Sound.INTERRUPT_ANY);
	
	this.update = function(gameArray,index) {
		if (this.bounds(gameArray,index) || this.health <= 0) {
			this.kill(gameArray,index);
			return;
		} else {
			this.move();
			this.draw();
		}
	}
	
	this.bounds = function(gameArray,index) {
		var check = this.checkBounds(this.width,this.height);
		if (check[0] != -1 || check[1] != -1) {
			return true;
		} else {
			return false;
		}
	}
};
asMovable.call(Projectile.prototype);

//Enemy logic. Will probably be seperated out when more enemy types come into play. 
var Enemy = function(startingX,startingY,width,height,imgLeft,imgRight,audio,health) {
	this.width = width;
	this.height = height;
	this.imgLeft = imgLeft;
	this.imgRight = imgRight;
	this.img = imgLeft;
	this.x = startingX;
	this.y = startingY;
	this.velX = 0;
	this.velY = 0;
	this.maxXSpeed = 4;
	this.maxYSpeed = 3;
	this.health = health;
	this.accelerationX = 1;
	this.accelerationY = 1;
	this.shotChance = .003;
	this.deathSound = audio;
	this.points = 1;
	this.weapon = new defaultGun();
	
	this.update = function(gameArray,index) {
		if (this.health <= 0) {
			this.kill(gameArray,index);
		}
		if (Math.random() < .5) {
			this.accelerate(0,this.accelerationY);
		} else {
			this.accelerate(0,-this.accelerationY);
		}
		this.accelerate(-this.accelerationX,0);
		this.move();
		this.bounds();
		
		if (Math.random() < this.shotChance) {
			this.weapon.shoot(this,Game.player1,false);
		}
		this.updateCooldowns();
		this.draw();
	}
	
	this.bounds = function() {
		var check = this.checkBounds();
		if (check[0] != -1) {
			this.accelerationX *= -3;
			this.maxXSpeed = 6;
			this.maxYSpeed = 6;
			this.shotChance *= 100;
			this.x  -= (this.accelerationX*3);
			this.img = this.imgRight;
		}
		
		if (check[1] != -1) {
			this.y = check[1];
		}
	}
	
	this.equip = function(weapon) {
		this.weapon = weapon;
	}
	
	this.updateCooldowns = function() {
		if (this.weapon.currentCooldown > 0) {
			this.weapon.currentCooldown--;
		}
	}
}
asMovable.call(Enemy.prototype);

var PowerUp = function(width,height,img,weapon,x,y) {
	this.width = width;
	this.height = height;
	this.img = img;
	this.x = typeof x !== 'undefined' ? x : Game.canvas.width - this.width;
	this.y = typeof y !== 'undefined' ? y : Math.random() * (Game.canvas.height - this.height);
	this.velX = -6;
	this.velY = 0;
	this.accelerationX = 1;
	this.accelerationY = 1;
	this.weapon = typeof weapon !== 'undefined' ? weapon : "special";
	
	this.update = function(gameArray,index) {
		if (this.bounds()) {
			this.kill(gameArray,index);
			return;
		}
		this.move();
		this.bounds(gameArray,index);
		this.draw();
	}
	
	this.bounds = function(gameArray,index) {
		var check = this.checkBounds(this.width,this.height);
		if (check[0] != -1 || check[1] != -1) {
			return true;
		} else {
			return false;
		}
	}
}
asMovable.call(PowerUp.prototype);

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