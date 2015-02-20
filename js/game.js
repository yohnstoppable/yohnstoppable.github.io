//				********************	Main Game function	**********************
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

Game = {
	canvas : document.getElementById('myCanvas'),
	ctx : document.getElementById("myCanvas").getContext("2d"),
	projectiles : [],
	badProjectiles : [],
	maxProjectiles : 10,
	projectileCooldown : 0,
	enemies: [],
	maxEnemies : 10,
	enemyCooldown : 20,
	enemyTimer : 20,
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
	
	//********************	Main Game Loop	**********************
	gameLoop : function() {
		setTimeout//(function() {	
			if (!Game.paused) {

				if (Game.enemyTimer <= 0) {
					Game.spawnEnemy();
				}

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
								Game.enemies[n].getDestroyed(n);
								Game.projectiles[i].getDestroyed(Game.projectiles,i);
								break;
							}
						}
					}
				}
				
				//********************	Set any cooldowns before restarting loop.	**********************					
				if (Game.projectileCooldown > 0) {
					Game.projectileCooldown --;
				}
				
				if (Game.enemyTimer > 0) {
					Game.enemyTimer--;
				}
				
				if (Game.pauseCooldown > 0) {
					Game.pauseCooldown--;
				}
				requestAnimationFrame(Game.gameLoop);
			}
		//},1000/Game.fps);
	},
	
	//******************** 	Code for spawning game objects	**********************
	spawnProjectile : function(obj) {
		var projectileSpeed = 15;
		
		var changeY = Game.mousePosition.y - obj.y - obj.height;
		var changeX = Game.mousePosition.x - obj.x;
		
		var hyp = Math.sqrt(Math.pow(changeX,2) + Math.pow(changeY,2));
		
		var rise = changeY * (projectileSpeed/hyp);
		var run = changeX * (projectileSpeed/hyp);
		

		document.getElementById("slope").innerHTML = "rise === " + rise + ", run === " + run;

		if (Game.projectiles.length <= Game.maxProjectiles) {
			Game.projectiles[Game.projectiles.length] = new Projectile(obj,50,25,Game.imageObj[1],run,rise,Game.sounds[0]);
			Game.projectileCooldown = 5;
		}
	},
	
	spawnBadProjectile : function(obj) {
		Game.badProjectiles[Game.badProjectiles.length] = new Projectile(obj,50,25,Game.imageObj[5],-15,0,Game.sounds[1]);
	},
	
	spawnEnemy : function () {
		if (Game.enemies.length <= Game.maxEnemies) {
			Game.enemies[Game.enemies.length] = new Enemy(50,50,Game.imageObj[2],Game.sounds[3]);
			Game.enemyTimer = Game.enemyCooldown;
		}
	},
	
	//******	Simple collision check between two objects. Will rework if/when more complex objects are created ******
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
	
	draw : function (obj) {
		Game.ctx.drawImage(obj.img, obj.x, obj.y,obj.width,obj.height);
	},
	
	preload : function() {
		var loadScreenDisplayed = false;
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
		document.getElementById("items").innerHTML = Game.itemsToLoad;
		if (Game.itemsToLoad <= 0) {
			Game.createGameObjects();
		}
	},
	
	createGameObjects : function() {
		//create initial objects
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
		Game.gameLoop();
	},
	
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