//Holds all the weapons to be equipped by enemies and player
var defaultGun = function() {
	this.bulletSpeed = 10;
	this.speed = {x: 0, y: 0};
	this.cooldown = 15;
	this.currentCooldown = 0;
	this.img = Game.imageObj[1];
	this.width = 25;
	this.height = 25;
	this.spawnSound = Game.sounds[0];
	this.velX = 0;
	this.velY = 0;
	this.health = 2;
	this.bullets = -1;
}

defaultGun.prototype.shoot = function(obj,target,goodProjectile) {
	if (this.currentCooldown > 0 ) {
		return;
	}
	
	projectileArray = Game.getProjectileArray(goodProjectile);
	
	this.speed = Common.getRiseRun(obj,target,this.bulletSpeed);
	projectileArray[projectileArray.length] = new Projectile(obj,this);
	this.currentCooldown = this.cooldown;
}

var machineGun = function() {
	this.bulletSpeed = 15;
	this.speed = {x: 0, y: 0};
	this.cooldown = 5;
	this.currentCooldown = 0;
	this.img = Game.imageObj[1];
	this.width = 15;
	this.height = 15;
	this.spawnSound = Game.sounds[0];
	this.velX = 0;
	this.velY = 0;
	this.health = 1;
	this.bullets = 100;
}

machineGun.prototype.shoot = function(obj,target,goodProjectile) {
	if (this.currentCooldown > 0 ) {
		return;
	}
	
	projectileArray = Game.getProjectileArray(goodProjectile);
	
	this.speed = Common.getRiseRun(obj,target,this.bulletSpeed);
	this.bullets--;
	projectileArray[projectileArray.length] = new Projectile(obj,this);
	this.currentCooldown = this.cooldown;
}
var spread = function() {
	this.bulletSpeed = 12;
	this.speed = {x: 0, y: 0};
	this.cooldown = 5;
	this.currentCooldown = 0;
	this.img = Game.imageObj[1];
	this.width = 20;
	this.height = 20;
	this.spawnSound = Game.sounds[0];
	this.velX = 0;
	this.velY = 0;
	this.health = 2;
	this.bullets = 100;
	this.offsetY = [-20,-10,0,10,20,10,0,-10];
	this.offsetIndex = 0;
}

spread.prototype.shoot = function(obj,target,goodProjectile) {
	if (this.currentCooldown > 0 ) {
		return;
	}
	var originalAngle = 0;
	var newAngle = 0;
	var newX = 0;
	var newY = 0;
	projectileArray = Game.getProjectileArray(goodProjectile);
	
	this.speed = Common.getRiseRun(obj,target,this.bulletSpeed);
	
	originalAngle = Math.acos(this.speed.x/this.bulletSpeed);
	newAngle = originalAngle + (this.offsetY[this.offsetIndex] * Math.PI/180);
	
	newX = this.bulletSpeed * Math.cos(newAngle);
	newY = this.bulletSpeed * Math.sin(newAngle);
	
	if (this.speed.y < 0) {
		newY *= -1;
	}
	
	this.speed.x = newX;
	this.speed.y = newY;

	this.bullets--;
	projectileArray[projectileArray.length] = new Projectile(obj,this);
	this.currentCooldown = this.cooldown;
	if (this.offsetIndex >= 7) {
		this.offsetIndex = 0;
	} else {
		this.offsetIndex++;
	}
	
}

var blaster = function() {
	this.defaultTargetX = Game.canvas.width*2;
	this.defaultTargetY = Game.canvas.height*2;
	this.targetObject = {
		x : this.defaultTargetX, 
		y : this.defaultTargetY
	}
	this.bulletSpeed = 15;
	this.speed = {x: 0, y: 0};
	this.cooldown = 200;
	this.currentCooldown = 0;
	this.img = Game.imageObj[1];
	this.width = 25;
	this.height = 25;
	this.spawnSound = Game.sounds[0];
	this.velX = 0;
	this.velY = 0;
	this.health = 2;		
}

blaster.prototype.shoot = function(obj,target,goodProjectile) {
	if (this.currentCooldown > 0 ) {
		return;
	}
	projectileArray = Game.getProjectileArray(goodProjectile);
	for (var i=0; i < 16; i++) {
		this.speed = Common.getRiseRun(obj,this.targetObject,20);
		projectileArray[projectileArray.length] = new Projectile(obj,this);
		this.speed.x *= -1;
		projectileArray[projectileArray.length] = new Projectile(obj,this);
		this.targetObject.y -= (Game.canvas.height/4);
	}
	
	this.targetObject = {
		x : this.defaultTargetX, 
		y : this.defaultTargetY
	}
	
	this.currentCooldown = this.cooldown;
}

var stingGun = function() {
	this.bulletSpeed = 15;
	this.speed = {x: 0, y: 0};
	this.cooldown = 25;
	this.currentCooldown = 0;
	this.img = Game.imageObj[11];
	this.width = 25;
	this.height = 7;
	this.spawnSound = Game.sounds[0];
	this.velX = 0;
	this.velY = 0;
	this.health = 1;
	this.bullets = -1;
}

stingGun.prototype.shoot = function(obj,target,goodProjectile) {
	if (this.currentCooldown > 0 ) {
		return;
	}
	
	projectileArray = Game.getProjectileArray(goodProjectile);
	
	this.speed = Common.getRiseRun(obj,target,this.bulletSpeed);
	projectileArray[projectileArray.length] = new Projectile(obj,this);
	this.currentCooldown = this.cooldown;
}

var noGun = function() {}

noGun.prototype.shoot = function(obj,target,goodProctile) {}