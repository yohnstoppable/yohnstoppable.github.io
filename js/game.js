//override requestAnimationFrame to make it work in other browsers
window.requestAnimationFrame = function(){
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback){
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();

//******************** Main Game function **********************
Game = {
	canvas : document.getElementById('myCanvas'),
	ctx : document.getElementById("myCanvas").getContext("2d"),
	projectiles : [],
	badProjectiles : [],
	maxProjectiles : 30,
	projectileCooldown : 0,
	enemies: [],
	maxEnemies : 7,
	enemyCooldown : 40,
	enemyTimer : 40,
	score : 0,
	keys : [],
	images : [],
	imageObj : [],
	sounds : [],
	paused : false,
	pauseCooldown : 10,
	fps : 60,
	isGameOver : false,
	itemsToLoad : 0,
	mousePosition : {x:0,y:0},
	specialCooldown : 0,
	highscore: 0,
	bossCooldown: 400,
	
	//********************	Main Game Loop	**********************
	gameLoop : function() {
		if (!Game.paused) {
			Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
			
			//********************	Update items on canvas	**********************		
			
			Game.background1.update();
			Game.background2.update()
			Game.player1.update();		
			
			if (Game.projectiles.length > 0) {
				for (var i=0; i < Game.projectiles.length; i++ ) {
					Game.projectiles[i].update(Game.projectiles, i);
				}
			}
			
			if (Game.badProjectiles.length > 0) {
				for (var i=0; i < Game.badProjectiles.length; i++ ) {
					Game.badProjectiles[i].update(Game.badProjectiles, i);
				}
			}
			
			if (Game.enemies.length > 0) {
				for (var i=0; i < Game.enemies.length; i++ ) {
					Game.enemies[i].update();
				}
			}
			
			//******************** Spawn enemies **********************	
			
			if (Game.enemyTimer <= 0) {
				Game.spawnEnemy();
			}
			
			if (Game.bossCooldown <= 0) {
				Game.spawnBoss();
			}
			
			//******************** Check for collisions **************************	
			
			//Player collision with enemy			
			if (Game.enemies.length) {
				for (var i=0; i < Game.enemies.length; i++ ) {
					if (Game.checkCollision(Game.player1, Game.enemies[i])) {
						Game.gameOver();
					}
				}
			}
			
			//Enemy projectiles collision with player1
			if (Game.badProjectiles.length > 0) {
				for (var i=0; i < Game.badProjectiles.length; i++ ) {
					if (Game.checkCollision(Game.badProjectiles[i],Game.player1)) {	
						Game.gameOver();
					}
				}
			}
			
			//Player projectiles collision with enemies
			if (Game.projectiles.length > 0 && Game.enemies.length > 0) {
				for (var i=0; i < Game.projectiles.length; i++ ) {
					for (var n=0; n < Game.enemies.length; n++) {
						if (Game.checkCollision(Game.projectiles[i],Game.enemies[n])) {	
							Game.enemies[n].getDamaged(Game.enemies,n,1);
							Game.projectiles[i].getDamaged(Game.projectiles,i,1);
							break;
						}
					}
				}
			}
			
			//******************** Increment before restarting loop **********************					
			Game.incrementCooldowns();
			
			if (Game.highscore < Game.score) {
				Game.highscore = Game.score;
				document.getElementById("highscore").innerHTML = "High Score: " + Game.highscore;
			}
			requestAnimationFrame(Game.gameLoop);
		}
	},
	
	//******************** 	Code for spawning game objects	**********************
	
	spawnProjectile : function(obj, target, speed) {
		var speed = Game.getRiseRun(obj, target, speed);

		if (Game.projectiles.length <= Game.maxProjectiles) {
			Game.projectiles[Game.projectiles.length] = new Projectile(obj,50,25,Game.imageObj[1],speed.x,speed.y,Game.sounds[0]);
			Game.projectileCooldown = 15;
		}
	},
	
	spawnBadProjectile : function(obj, target, speed) {
		var speed = Game.getRiseRun(obj, target, speed);
		var angle = (Math.atan2(speed.x, speed.y) + (Math.PI/2)) * -1;
		Game.badProjectiles[Game.badProjectiles.length] = new Projectile(obj,50,25,Game.imageObj[5],speed.x,speed.y,Game.sounds[1],angle);
	},
	
	spawnEnemy : function () {
		if (Game.enemies.length <= Game.maxEnemies) {
			Game.enemies[Game.enemies.length] = new Enemy(50,50,Game.imageObj[2],Game.sounds[3],1);
			Game.enemyTimer = Game.enemyCooldown;
		}
	},
	
	spawnBoss : function () {
		Game.enemies[Game.enemies.length] = new Enemy(200,200,Game.imageObj[2],Game.sounds[3],30);
		Game.enemies[Game.enemies.length-1].velX = 0;
		Game.enemies[Game.enemies.length-1].maxSpeedx = 6;
		Game.enemies[Game.enemies.length-1].accelerationX = 0;
		Game.enemies[Game.enemies.length-1].accelerationY= 3;
		Game.enemies[Game.enemies.length-1].shotChance = .03;
		Game.enemies[Game.enemies.length-1].points = 50;
		Game.sounds[5].play();
		Game.bossCooldown = 1000;
	},
	
	spawnSpecial : function(obj) {
		var targetObject = {
			x : obj.x + 1000, 
			y : obj.y + 1000
		}
		
		var speed = 0;
		var angle = 0;
		
		for (var i=0; i < 16; i++) {
			speed = Game.getRiseRun(obj,targetObject,20);
			Game.projectiles[Game.projectiles.length] = new Projectile(obj,50,25,Game.imageObj[1],speed.x,speed.y,Game.sounds[0]);
			Game.projectiles[Game.projectiles.length] = new Projectile(obj,50,25,Game.imageObj[1],-speed.x,speed.y,Game.sounds[0]);
			Game.projectiles[Game.projectiles.length-1].health = 3;
			Game.projectiles[Game.projectiles.length-2].health = 3;
			targetObject.y -= (Game.canvas.height/4);
		}
		Game.specialCooldown = 200;
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
	
	//calculates the speed of x and y according to the speed and how far to the side and up/down a target is
	getRiseRun : function(obj,target,speed) {
		var projectileSpeed = speed;
		var offsetX = 0;
		var offsetY = 0;
		if (typeof(target.width) != "undefined") {
			var offsetX = target.width;
		}
		
		if (typeof(target.height) != "undefined") {
			var offsetY = target.height;
		}
		
		if (typeof(obj.height) != "undefined") {
			var offsetY2 = obj.height;
		}
		
		var rise = target.y - obj.y + (offsetY/2) - (offsetY2/2);
		var run = target.x - obj.x + (offsetX/2);
		
		var hyp = Math.sqrt(Math.pow(run,2) + Math.pow(rise,2));
		
		rise *= (projectileSpeed/hyp);
		run *= (projectileSpeed/hyp);
		
		return {
			x : run,
			y : rise
		};
	},
	
	//increment any cooldowns we have
	incrementCooldowns : function() {
		if (Game.projectileCooldown > 0) {
			Game.projectileCooldown --;
		}
		
		if (Game.enemyTimer > 0) {
			Game.enemyTimer--;
		}
		
		if (Game.pauseCooldown > 0) {
			Game.pauseCooldown--;
		}
		
		if (Game.specialCooldown > 0) {
			Game.specialCooldown--;
		}
		
		if (Game.bossCooldown > 0) {
			Game.bossCooldown--;
		}
	},
	
	//********** Draw Game Objects **********
	draw : function (obj) {
		Game.ctx.drawImage(obj.img, obj.x, obj.y,obj.width,obj.height);
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
	},
	
	//preloads images and sounds before game starts
	preload : function() {
		Game.ctx.font = "100px Georgia";
		Game.ctx.fillStyle = "white";
		Game.ctx.fillText("Loading",175,175);
		
		//set images sources
		Game.images[0] = "images/ship.png";
		Game.images[1] = "images/lazerBlue.png";
		Game.images[2] = "images/enemy.jpg";
		Game.images[3] = "images/background1.jpg";
		Game.images[4] = "images/background2.jpg";
		Game.images[5] = "images/lazerRed.png";
		Game.images[6] = "images/explosion.png";	
		Game.itemsToLoad += Game.images.length;
		
		//preload sounds;
		Game.sounds[0] = new Audio("audio/lazerShot.mp3");
		Game.sounds[1] = new Audio("audio/lazerShotBad.mp3");
		Game.sounds[2] = new Audio("audio/death.mp3");
		Game.sounds[3] = new Audio("audio/hit.mp3");
		Game.sounds[4] = new Audio("audio/hahaha.mp3");
		Game.sounds[5] = new Audio("audio/zipzop.mp3");
		Game.itemsToLoad += Game.sounds.length;
		
		//preload images and add load listeners
		for (var i=0; i < Game.images.length; i++) {
			Game.imageObj[i] = new Image();
			Game.imageObj[i].src = Game.images[i];
			Game.imageObj[i].addEventListener('load', Game.checkLoading(), false);
		}
		
		//add load listeners to sounds
		for (var i=0; i < Game.sounds.length; i++) {
			Game.sounds[i].addEventListener('load', Game.checkLoading(), false);
		}
	},
	
	//increments items to load and starts game loop if 0
	checkLoading : function(items) {
		Game.itemsToLoad--;
		if (Game.itemsToLoad <= 0) {
			Game.createGameObjects();
		}
	},
	
	//create initial objects
	createGameObjects : function() {
		Game.player1 = new Player(1,1,75,50,"dude",Game.imageObj[0]);
		Game.background1 = new scrollingBackGround(Game.imageObj[3], 3000, Game.canvas.height, -5, 0, -3000, 3000);
		Game.background2 = new scrollingBackGround(Game.imageObj[4], 3000, Game.canvas.height, -5, 3000, -3000, 3000);	
		Game.gameLoop();
	},
	
	//resets all arrays and player value. 
	restart : function () {
		Game.player1.reset();
		Game.projectiles = [];
		Game.badProjectiles = [];
		Game.enemies = [];
		Game.isGameOver = false;
		Game.paused = false;
		Game.score = 0;
		Game.player1.img.src = Game.images[0];
		Game.specialCooldown = 0;
		Game.bossCooldown = 400;
		Game.enemyTimer = 50;
		Game.gameLoop();
	},
	
	//Self explanatory. Added a cooldown so doesn't immediately retrigger 
	pauseGame : function() {
		if (!Game.paused && Game.pauseCooldown <= 0) {
			Game.paused = true;
			Game.pauseCooldown = 10;
		} else if (Game.paused && !Game.isGameOver) {
			Game.paused = false;
			Game.gameLoop();
		}
	},
	
	gameOver : function() {
		Game.isGameOver = true;
		Game.paused = true;
		Game.ctx.fillText("Game Over!",175,175);
		Game.ctx.fillText("Score: " + Game.score, 175,275);
		Game.player1.img.src = Game.images[6];
		Game.player1.update();
		Game.sounds[2].play();
		Game.sounds[4].play();
	}
};
	
//			**********		Bindings		********
window.onload = function() {
	Game.preload();
}

window.addEventListener('keydown', function(event) {
	Game.keys[event.keyCode] = true;
	if (Game.keys[13]) {
		Game.pauseGame();
	}
	
	if (Game.keys[69]) {
		if (Game.isGameOver) {
			Game.restart();
		}
	}
	event.preventDefault();
});

window.addEventListener('keyup', function(event) {
	Game.keys[event.keyCode] = false;
	event.preventDefault();
});

function getMousePos(canvas, e) {
	var rect = canvas.getBoundingClientRect();
	return {
        x: e.clientX - rect.left,
		y: e.clientY - rect.top
	};
}

Game.canvas.addEventListener('mousemove', function(e) {
	Game.mousePosition = getMousePos(Game.canvas, e);
}, false);

Game.canvas.addEventListener('touchmove', touchHandler, false);
Game.canvas.addEventListener('touchstart', touchHandler, false);
Game.canvas.addEventListener("touchend", touchEndHandler, false);

function touchHandler(e) {
    alert("test");

    /* determine what gesture was performed, based on dx and dy (tap, swipe, one or two fingers etc. */

}