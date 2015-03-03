Stage = {
	ticker : 0,
	stageNumber : 1,
	enemyTimer : 80,
	defaultEnemyTimer : 80,
	waspTimer : 150,
	defaultWaspTimer : 150,
	bossTimer : 500,
	defaultBossTimer : 500,
	waspBossTimer : 1500,
	defaultWaspBossTimer : 1500,
	difficulty : 0,
	defaultDifficulty : 0,
	difficultyTimer : 150,
	powerUpTimer : 600,
	update : function() {
		Stage.ticker++;
		if (Stage.ticker % Stage.difficultyTimer === 0) {
			Stage.difficulty++;
		}
		if (Stage.ticker % (Stage.enemyTimer-Stage.difficulty) === 0) {
			Stage.spawnEnemy(Math.ceil(Math.random()*3 + (Stage.difficulty/10)));
		}
		
		if (Stage.ticker % (Stage.waspTimer-Stage.difficulty) === 0) {
			Stage.spawnWasp(Math.ceil(Math.random()*6 + (Stage.difficulty/7)));
		}
		
		if (Stage.ticker % (Stage.bossTimer - (Stage.difficulty*3)) === 0) {
			Stage.spawnBoss();
		}
		
		if (Stage.ticker % Stage.powerUpTimer === 0) {
			Stage.spawnPowerUp();
		}
	},
	//******************** 	Code for spawning game objects	**********************	
	spawnEnemy : function (amount) {
		amount = typeof amount !== 'undefined' ? amount : 1;
		for (i=0; i<=amount; i++) {
			Game.enemies[Game.enemies.length] = new Enemy(75,50,Game.imageObj[12],Game.imageObj[13],Game.sounds[3],1);
		}
	},
	
	spawnWasp : function (amount) {
		amount = typeof amount !== 'undefined' ? amount : 1;
		for (i=0; i<=amount; i++) {
			Game.enemies[Game.enemies.length] = new Enemy(75,50,Game.imageObj[2],Game.imageObj[9],Game.sounds[3],1);
			Game.enemies[Game.enemies.length-1].equip(new noGun());
			Game.enemies[Game.enemies.length-1].shotChance = 0;
			Game.enemies[Game.enemies.length-1].maxXSpeed = 8;
			Game.enemies[Game.enemies.length-1].maxYSpeed = 8;
			Game.enemies[Game.enemies.length-1].accelerationX = 2;
			Game.enemies[Game.enemies.length-1].accelerationY = 3;
		}
	},
	
	spawnBoss : function () {
		Game.enemies[Game.enemies.length] = new Enemy(175,150,Game.imageObj[12],Game.imageObj[13],Game.sounds[3],30);
		Game.enemies[Game.enemies.length-1].velX = 0;
		Game.enemies[Game.enemies.length-1].maxSpeedx = 6;
		Game.enemies[Game.enemies.length-1].accelerationX = 0;
		Game.enemies[Game.enemies.length-1].accelerationY= 3;
		Game.enemies[Game.enemies.length-1].shotChance = .03;
		Game.enemies[Game.enemies.length-1].points = 50;
		Game.enemies[Game.enemies.length-1].weapon.width = 50;
		Game.enemies[Game.enemies.length-1].weapon.height = 15;
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
		Stage.enemyTimer = Stage.defaultEnemyTimer;
		Stage.bossTimer = Stage.defaultBossTimer;
		Stage.ticker = 0;
	}
}