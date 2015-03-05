//override requestAnimationFrame to make it work in other browsers
window.requestAnimationFrame = function(){
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback){
            window.setTimeout(callback, 1000 / 10);
        }
    );
}();

//******************** Main Game function **********************
Game = {
	canvas : document.getElementById('myCanvas'),
	ctx : document.getElementById("myCanvas").getContext("2d"),
	projectiles : [],
	badProjectiles : [],
	powerUps : [],
	enemies: [],
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
	touchesInAction : [],
	highscore: 0,
	
	//********************	Main Game Loop	**********************
	gameLoop : function() {
		setTimeout(function() {
    
		if (!Game.paused) {
			Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
			
			//********************	Update items on canvas	**********************		
			
			Game.background1.update();
			Game.background2.update();
			Game.player1.update();	
			Stage.update();
			
			if (Game.powerUps.length > 0) {
				for (var i=0; i < Game.powerUps.length; i++ ) {
					Game.powerUps[i].update(Game.powerUps, i);
				}
			}
			
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
					if (Common.checkCollision(Game.player1, Game.enemies[i])) {
						Game.gameOver();
					}
				}
			}
			
			//Enemy projectiles collision with player1
			if (Game.badProjectiles.length > 0) {
				for (var i=0; i < Game.badProjectiles.length; i++ ) {
					if (Common.checkCollision(Game.badProjectiles[i],Game.player1)) {	
						Game.gameOver();
					}
				}
			}
			
			//Player projectiles collision with enemies
			if (Game.projectiles.length > 0 && Game.enemies.length > 0) {
				for (var i=0; i < Game.projectiles.length; i++ ) {
					for (var n=0; n < Game.enemies.length; n++) {
						if (Common.checkCollision(Game.projectiles[i],Game.enemies[n])) {	
							Game.enemies[n].damage(Game.enemies,n,1);
							Game.projectiles[i].damage(Game.projectiles,i,1);
							break;
						}
					}
				}
			}
			
			//Player collision with powerUps
			if (Game.powerUps.length > 0) {
				for (var i=0; i< Game.powerUps.length; i++) {
					if (Common.checkCollision(Game.powerUps[i],Game.player1)) {
						Game.player1.equip(Game.powerUps[i].weapon);
						Game.powerUps[i].damage(Game.powerUps,i,1);
						break;
					}
				}
			}
			
			//******************** Increment before restarting loop **********************					
			Game.incrementCooldowns();
			
			if (Game.highscore < Game.score) {
				Game.highscore = Game.score;
			}
			requestAnimationFrame(Game.gameLoop);
		}}, 1000 / Game.fps);
	},

	getProjectileArray : function(goodProjectile) {
		if (goodProjectile) {
			return Game.projectiles;
		} else {
			return Game.badProjectiles;
		}
	},
	
	//increment any cooldowns we have
	incrementCooldowns : function() {
		if (Game.pauseCooldown > 0) {
			Game.pauseCooldown--;
		}
	},
	
	//preloads images and sounds before game starts
	preload : function() {
		if (window.innerHeight > window.innerWidth) {
			Game.canvas.height = window.innerWidth;
			Game.canvas.width = window.innerHeight;
		} else {
			Game.canvas.height = window.innerHeight;
			Game.canvas.width = window.innerWidth;
		}
		Game.ctx.font = "100px Georgia";
		Game.ctx.fillStyle = "white";
		Game.ctx.fillText("Loading",175,175);
		
		//set images sources
		Game.images[0] = "images/paperAirplane.png";
		Game.images[1] = "images/paperBall.png";
		Game.images[2] = "images/wasp.png";
		Game.images[3] = "images/background1.jpg";
		Game.images[4] = "images/background2.jpg";
		Game.images[5] = "images/paperBall.png";
		Game.images[6] = "images/explosion.png";	
		Game.images[7] = "images/machineGun.png";
		Game.images[8] = "images/spread.png";		
		Game.images[9] = "images/wasp2.png";	
		Game.images[10] = "images/paperAirplane2.png";
		Game.images[11] = "images/stinger2.png";
		Game.images[12] = "images/enemyPlane.png";
		Game.images[13] = "images/enemyPlane2.png";
		Game.itemsToLoad += Game.images.length;

		Game.sounds[0] = "audio/lazerShot.mp3";
		Game.sounds[1] = "audio/lazerShotBad.mp3";
		Game.sounds[2] = "audio/death.mp3";
		Game.sounds[3] = "audio/hit.mp3";
		Game.sounds[4] = "audio/hahaha.mp3";
		Game.sounds[5] = "audio/zipzop.mp3";
		
		//preload sounds
		for (var i=0; i< Game.sounds.length; i++) {
			createjs.Sound.registerSound(Game.sounds[i]);
		}
		
		//preload images and add load listeners
		for (var i=0; i < Game.images.length; i++) {
			Game.imageObj[i] = new Image();
			Game.imageObj[i].addEventListener('load', Game.checkLoading(), false);
			Game.imageObj[i].src = Game.images[i];
			
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
		Game.player1 = new Player(1,1,75,50,"dude",Game.imageObj[10],Game.imageObj[0]);
		Game.background1 = new scrollingBackGround(Game.imageObj[3], 3000, Game.canvas.height, -5, 0, -3000, 3000);
		Game.background2 = new scrollingBackGround(Game.imageObj[4], 3000, Game.canvas.height, -5, 3000, -3000, 3000);	
		Game.gameLoop();
	},
	
	//resets all arrays and player value. 
	restart : function () {
		Game.player1.reset();
		Stage.reset();
		Game.projectiles = [];
		Game.badProjectiles = [];
		Game.enemies = [];
		Game.powerUps = [];
		Game.isGameOver = false;
		Game.paused = false;
		Game.score = 0;
		Game.player1.img = Game.images[0];
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
		Game.player1.img = Game.imageObj[6];
		Game.player1.draw();
		createjs.Sound.play(Game.sounds[2]);
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
	if (Projectile.prototype.health === 1) {
		Projectile.prototype.health = 4;
	}
	e.preventDefault();
	if (e.type === "touchstart") {
		if (Game.isGameOver) {
			Game.restart();
		}
	}
    var touches = e.changedTouches;

    for(var j = 0; j < touches.length; j++) {
		Game.touchesInAction[touches[j].identifier] = {
            identifier : touches[j].identifier,
            x : touches[j].pageX,
            y : touches[j].pageY
         };
    }
}
function touchEndHandler(e) {
	e.preventDefault();
    var touches = e.changedTouches;

    for(var j = 0; j < touches.length; j++) {
		Game.touchesInAction.splice(touches[j].identifier,1);
    }
}