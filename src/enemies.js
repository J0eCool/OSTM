EnemyManager = {
	numEnemies: 6,
	enemyDefs:  [
		new EnemyDef({
			name: 'Enemy',
			image: 'img/Shroomie.png',
			health: 22,
			gold: 3
		}),
		new EnemyDef({
			name: 'Wall',
			image: 'img/Bricks.png',
			health: 40,
			xp: 4,
			forge: 2,
			gold: 4,
		}),
		new EnemyDef({
			minLevel: 3,
			name: 'Swirl',
			image: 'img/CircleTestPattern.png',
			health: 36,
			attack: 7,
			xp: 7,
			forge: 3,
			gold: 6
		})
	],

	enemies: [],
	activeEnemies: [],
	jqField: null,
	jqAdventure: null,

	level: 1,

	levelUpPoints: 0,
	pendingLevelUpPoints: 0,
	maxLevelUnlocked: 1,

	getAppropriateEnemy: function() {
		var enemies = [];
		for (var i = 0; i < this.enemyDefs.length; i++) {
			if (this.enemyDefs[i].minLevel <= this.level) {
				enemies.push(this.enemyDefs[i]);
			}
		}
		return randItem(enemies);
	},

	init: function() {
		this.jqField = $('.field');
		this.jqAdventure = $('.adventure');
		var fieldHtml = '';

		fieldHtml += 'Current Enemy Level: <span id="enemy-level"></span><br />' +
			getButtonHtml("AdventureScreen.setScreen('map-select')", 'Map', 'map-button') +
			getButtonHtml('EnemyManager.decreaseLevel()', 'Decrease Level', 'dec-level') +
			getButtonHtml("EnemyManager.increaseLevel()", 'Increase Level', 'inc-level')
			//+ '<div class="stage-progress-background"><div class="stage-progress-foreground"></div></div>'
		;

		this.enemies = [];
		for (var i = 0; i < this.numEnemies; i++) {
			var enemy = new EnemyContainer(i);
			this.enemies.push(enemy);
			fieldHtml += enemy.getHtml();
		}

		this.jqField.html(fieldHtml);

		$(".enemy").click(function() {
			var index = $(this).attr('index');
			EnemyManager.enemies[index].onClick();
		});

		this.spawnEnemies();

		this.updateUI();
	},

	spawnEnemies: function() {
		this.activeEnemies = [];
		var maxToSpawn = clamp(this.level, 2, 5);
		var numToSpawn = Math.min(this.enemies.length, randIntInc(2, maxToSpawn));
		$('.enemy-container').hide();
		for (var i = 0; i < numToSpawn; i++) {
			var enemy = this.enemies[i];
			enemy.getSelector().show();
			enemy.respawn(this.getAppropriateEnemy());
			this.activeEnemies.push(enemy);
		}
	},

	despawnEnemy: function(enemy) {
		removeItem(enemy, this.activeEnemies);
		enemy.getSelector().hide();
		this.pendingLevelUpPoints += 1;
		if (this.activeEnemies.length === 0) {
			if (this.level >= this.maxLevelUnlocked) {
				this.levelUpPoints += this.pendingLevelUpPoints;
				if (this.levelUpPoints >= this.getIncreaseLevelCost()) {
					this.levelUpPoints = 0;
					this.maxLevelUnlocked++;
					this.updateHeaderButtons();
				}

				this.updateProgressBar();
			}

			this.pendingLevelUpPoints = 0;
			this.spawnEnemies();
		}
	},

	updateUI: function() {
		this.updateHeaderButtons();
		this.updateProgressBar();
	},

	updateHeaderButtons: function() {
		$('#enemy-level').text(this.level);
		$('#dec-level').toggle(this.level > 1);
		$('#inc-level').toggle(this.level < this.maxLevelUnlocked);
	},

	updateProgressBar: function() {
		var pct = 100 * this.levelUpPoints / this.getIncreaseLevelCost();
		$('.stage-progress-foreground').width(pct + '%');
		$('.stage-progress-background').toggle(this.level == this.maxLevelUnlocked);
	},

	decreaseLevel: function() {
		this.level--;
		this.spawnEnemies();
		this.updateUI();
	},

	increaseLevel: function() {
		this.level++;
		this.spawnEnemies();
		this.updateUI();
	},

	getIncreaseLevelCost: function() {
		return 1;
		//return Math.min(Math.floor(5 + this.maxLevelUnlocked), 12);
	}
};

function EnemyDef(data) {
	this.name = data.name || "Enemy";
	this.image = data.image || "img/Shroomie.png";

	this.minLevel = data.minLevel || 0;

	this.health = data.health || 10;
	this.attack = data.attack || 5;

	this.xp = data.xp || 3;
	this.gold = data.gold || 1;
	this.forge = data.forge || 1;
}

function EnemyContainer(index) {
	this.index = index;
	this.level = 0;

	this.health = 0;
	this.maxHealth = 0;
	this.attack = 0;

	this.xp = 0;
	this.gold = 0;

	this.x = 0;
	this.y = 0;

	this.getHtml = function() {
		return '<div class="enemy-container" index='+this.index+'>' +
				'<div class="name"></div>' +
				'<div class="health-background">' +
					'<div class="health-foreground enemy-health-'+this.index+'"></div>' +
				'</div>' +
				'<div><img class="enemy" draggable="false" index="'+this.index+'" /></div>' +
			'</div>';
	};

	this.selector = null;
	this.getSelector = function() {
		if (!this.selector) {
			this.selector = $('.enemy-container[index='+this.index+']');
		}
		return this.selector;
	};

	this.isActive = function() {
		return EnemyManager.activeEnemies.indexOf(this) >= 0;
	};

	this.respawn = function(def) {
		this.level = EnemyManager.level;

		var powerMult = (this.level + 1) / 2 + (Math.pow(1.1, this.level - 1) - 1);
		var rewardMult = this.level + (Math.pow(1.07, this.level - 1) - 1);

		this.maxHealth = Math.floor(def.health * powerMult);
		this.health = this.maxHealth;
		this.attack = Math.floor(def.attack * powerMult);

		this.xp = Math.floor(def.xp * Math.pow(rewardMult, 1.8));
		this.gold = Math.floor(def.gold * Math.pow(rewardMult, 2.3));
		this.forge = Math.floor(def.forge * rewardMult);

		var sel = this.getSelector();

		sel.find('.enemy').attr('src', def.image);
		sel.find('.name').text(def.name);

		var width = sel.width();
		var height = sel.height();

		var margin = 30;

		var field = EnemyManager.jqField;
		var fieldWidth = field.width();
		var fieldHeight = field.height();

		this.x = rand(margin, fieldWidth - width - margin) / fieldWidth;
		this.y = rand(margin, fieldHeight - height - margin) / fieldHeight;

		this.updatePosition();
		this.updateHealthBar();
	};

	this.getRelativePosition = function() {
		var field = EnemyManager.jqField;
		return {
			x: field.width() * this.x,
			y: field.height() * this.y
		};
	};

	this.getAbsolutePosition = function() {
		var adventurePos = EnemyManager.jqAdventure.position();
		var pos = this.getRelativePosition();
		return {
			x: adventurePos.left + pos.x,
			y: adventurePos.top + pos.y
		};
	};

	this.updatePosition = function() {
		var pos = this.getRelativePosition();
		this.getSelector().css({
			'left': pos.x + 'px',
			'top': pos.y + 'px'
		});
	};

	this.attackPower = function() {
		return this.attack;
	};

	this.onClick = function() {
		var dealtDamage = this.attackPower();
		if (this.isActive() && Player.takeDamage(dealtDamage)) {
			this.takeDamage(Player.getRandomDamage());
		}
	};

	this.takeDamage = function(damage) {
		this.health -= damage;

		var sel = this.getSelector();
		var width = sel.width();
		var height = sel.height();

		var pos = this.getAbsolutePosition();
		var x = pos.x + randInt(-40, 40) + width / 2;
		var y = pos.y + randInt(-20, 0) + height / 2;
		ParticleContainer.create(damageParticleType, formatNumber(damage), x, y);

		if (this.health <= 0) {
			this.giveRewards();

			this.selector.find('.enemy').toggleClass('blur', false);

			EnemyManager.despawnEnemy(this);
		}
		else {
			this.animateHealthBar();

			var enemyImage = this.getSelector().find('.enemy');
			enemyImage.toggleClass('blur', true)
				.one('transitionend', function(e) {
					enemyImage.toggleClass('blur', false);
				});
		}
	};

	this.getHealthPercent = function() {
		return clamp(this.health / this.maxHealth, 0, 1) * 100;
	};

	this.animateHealthBar = function() {
		$('.enemy-health-'+this.index).stop(true, false)
			.animate({ width: this.getHealthPercent() + '%' }, 125);
	};

	this.updateHealthBar = function() {
		$('.enemy-health-'+this.index).stop(true, true).css('width', this.getHealthPercent() + '%');		
	};

	this.giveRewards = function() {
		Player.xp += this.xp;
		Player.gold += this.gold;
		Forge.addFill(this.forge);

		var rewardString = '<span class="xp-reward">' + getIconHtml('xp') + ' ' + formatNumber(this.xp) + '</span>' +
			'<br /><span class="gold-reward">' + getIconHtml('gold') + ' ' +  formatNumber(this.gold) + '</span>' +
			'<br /><span class="forge-reward">' + getIconHtml('forge') + ' ' + formatNumber(this.forge) + '</span>';

		var pos = this.getAbsolutePosition();
		ParticleContainer.create(rewardParticleType, rewardString, pos.x, pos.y);
	};

	this.handleResize = function(windowSize) {
		this.x *= windowSize.width / Game.windowSize.width;
		this.y *= windowSize.height / Game.windowSize.height;

		this.updatePosition();
	};
}
