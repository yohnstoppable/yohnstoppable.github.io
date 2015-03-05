Stage = {
	ticker : 0,
	bosses : 1,
	stageNumber : 1,
	enemyTimer : 80,
	waspTimer : 120,
	bossTimer : 500,
	difficulty : 0,
	defaultDifficulty : 0,
	difficultyTimer : 80,
	powerUpTimer : 600,
	update : function() {
		Stage.ticker++;
		if (Stage.ticker === 5) {
			Stage.spawnEnemy();
		}
		if (Stage.ticker % Stage.difficultyTimer === 0) {
			Stage.difficulty++;
		}
		if (Stage.ticker % (Stage.enemyTimer-Stage.difficulty) === 0) {
			Stage.spawnEnemy(Math.ceil(Math.random()*3 + (Stage.difficulty/10)));
		}
		
		if (Stage.ticker % (Stage.waspTimer-Stage.difficulty) === 0) {
			Stage.spawnWasp(Math.ceil(Math.random()*2 + (Stage.difficulty/10)));
		}
		
		if (Stage.ticker % (Stage.bossTimer - (Stage.difficulty*3)) === 0) {
			if (Stage.bosses % 3 === 0) {
				Stage.spawnWaspBoss();
				Stage.spawnWasp(Stage.difficulty);
			} else {
				Stage.spawnBoss();
			}
			Stage.bosses++;
		}
		
		if (Stage.ticker % Stage.powerUpTimer === 0) {
			Stage.spawnPowerUp();
		}
	},
	//******************** 	Code for spawning game objects	**********************	
	spawnEnemy : function (amount,x,y) {
		amount = typeof amount !== 'undefined' ? amount : 1;
		x = typeof x !== 'undefined' ? x : Game.canvas.width - 75;
		y = typeof y !== 'undefined' ? y : Math.random() * (Game.canvas.height - 50);
		for (i=0; i<amount; i++) {
			Game.enemies[Game.enemies.length] = new Enemy(x,y,75,50,Game.imageObj[12],Game.imageObj[13],Game.sounds[3],2);
		}
	},
	
	spawnWasp : function (amount,x,y) {
		amount = typeof amount !== 'undefined' ? amount : 1;
		x = typeof x !== 'undefined' ? x : Game.canvas.width - 75;
		y = typeof y !== 'undefined' ? y : Math.random() * (Game.canvas.height - 50);
		for (i=0; i<amount; i++) {
			Game.enemies[Game.enemies.length] = new Enemy(x,y,35,25,Game.imageObj[2],Game.imageObj[9],Game.sounds[3],1);
			Game.enemies[Game.enemies.length-1].maxXSpeed = 6;
			Game.enemies[Game.enemies.length-1].maxYSpeed = 6;
			Game.enemies[Game.enemies.length-1].accelerationX = 1;
			Game.enemies[Game.enemies.length-1].accelerationY = 3;
			Game.enemies[Game.enemies.length-1].shotChance = 0;
		}
	},
	
	spawnBoss : function () {
		Game.enemies[Game.enemies.length] = new Enemy(Game.canvas.width - 175,Math.random() * (Game.canvas.height - 150),175,150,Game.imageObj[12],Game.imageObj[13],Game.sounds[3],60);
		Game.enemies[Game.enemies.length-1].velX = 0;
		Game.enemies[Game.enemies.length-1].accelerationX = 0;
		Game.enemies[Game.enemies.length-1].accelerationY= 3;
		Game.enemies[Game.enemies.length-1].shotChance = .03;
		Game.enemies[Game.enemies.length-1].points = 50;
		Game.enemies[Game.enemies.length-1].weapon.width = 50;
		Game.enemies[Game.enemies.length-1].weapon.height = 15;
	},
	
	spawnWaspBoss : function (x,y) {
		x = typeof x !== 'undefined' ? x : Game.canvas.width - 175;
		y = typeof y !== 'undefined' ? y : Math.random() * (Game.canvas.height - 150);
		Game.enemies[Game.enemies.length] = new Enemy(x,y,175,150,Game.imageObj[2],Game.imageObj[7],Game.sounds[3],45);
		Game.enemies[Game.enemies.length-1].velX = 0;
		Game.enemies[Game.enemies.length-1].maxYSpeed = 6;
		Game.enemies[Game.enemies.length-1].accelerationX = 0;
		Game.enemies[Game.enemies.length-1].accelerationY= 3;
		Game.enemies[Game.enemies.length-1].shotChance = .03;
		Game.enemies[Game.enemies.length-1].points = 100;
		Game.enemies[Game.enemies.length-1].weapon.width = 50;
		Game.enemies[Game.enemies.length-1].weapon.height = 15;
		Game.enemies[Game.enemies.length-1].equip(new swarmGun());
	},
	
	spawnPowerUp : function() {
		if (Math.random() > .25) {
			Game.powerUps[Game.powerUps.length] = new PowerUp(40,20,Game.imageObj[7], new machineGun());
		} else {
			Game.powerUps[Game.powerUps.length] = new PowerUp(40,20,Game.imageObj[8], new spread());
		}
	},
	
	reset: function() {
		Stage.difficulty = Stage.defaultDifficulty;
		Stage.bosses = 1;
		Stage.ticker = 0;
	}
}