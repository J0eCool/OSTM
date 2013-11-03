EnemyManager = {
	numEnemies: 6,
	enemyDefs: {},

	curArea: null,

	enemies: [],
	activeEnemies: [],
	jqField: null,
	jqAdventure: null,

	subArea: 0,
	bestAvailableSubArea: 0,

	getAppropriateEnemy: function() {
		var enemies = [];
		for (var key in this.enemyDefs) {
			var e = this.enemyDefs[key];
			if (this.curArea.enemies.indexOf(e.name) >= 0) {
				enemies.push(e);
			}
		}
		return randItem(enemies);
	},

	init: function() {
		this.jqField = $('.field');
		this.jqAdventure = $('.adventure');

		this.enemyDefs = loadEnemies();
		this.curArea = AdventureScreen.adventures[0];

		var fieldHtml = '';

		fieldHtml += '<h2 id="area-name"></h2>' +
			getButtonHtml("AdventureScreen.setScreen('map-select')", 'Map', 'map-button') +
			getButtonHtml('EnemyManager.decreaseLevel()', 'Back', 'dec-level') +
			getButtonHtml("EnemyManager.increaseLevel()", 'Forward', 'inc-level')
		;

		this.enemies = [];
		for (var i = 0; i < this.numEnemies; i++) {
			var enemy = new EnemyContainer(i);
			this.enemies.push(enemy);
			fieldHtml += enemy.getHtml();
		}

		this.jqField.html(fieldHtml);
		$('#map-button').hide();

		$(".enemy").click(function() {
			var index = $(this).attr('index');
			EnemyManager.enemies[index].onClick();
		});

		if (!AdventureScreen.hasBeat('adv0')) {
			AdventureScreen.startAdventure('adv0');
		}
	},

	resetField: function() {
		if (this.curArea !== null) {
			this.subArea = 0;
			this.bestAvailableSubArea = -1;
			this.spawnEnemies();
			this.updateUI();
		}
	},

	spawnEnemies: function() {
		this.activeEnemies = [];
		var numToSpawn = Math.min(this.enemies.length,
			randIntInc(this.curArea.spawnCountLo, this.curArea.spawnCountHi));
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
		if (this.activeEnemies.length === 0) {
			this.bestAvailableSubArea = Math.max(this.subArea + 1, this.bestAvailableSubArea);
			if (this.bestAvailableSubArea >= this.curArea.levels.length) {
				this.curArea.hasBeat = true;
			}
			this.updateHeaderButtons();
			this.spawnEnemies();
		}
	},

	updateUI: function() {
		this.updateHeaderButtons();
	},

	updateHeaderButtons: function() {
		$('#area-name').text(this.curArea.displayName);
		$('#dec-level').toggle(this.subArea > 0);
		$('#inc-level').toggle(this.subArea < this.bestAvailableSubArea)
			.find('.content').text((this.subArea + 1 < this.curArea.levels.length) ?
				'Forward' : 'Area Complete');
	},

	decreaseLevel: function() {
		this.subArea--;
		this.spawnEnemies();
		this.updateUI();
	},

	increaseLevel: function() {
		if (this.subArea + 1 < this.curArea.levels.length) {
			this.subArea++;
			this.spawnEnemies();
			this.updateUI();
		}
		else {
			AdventureScreen.setScreen('map-select');
		}
	}
};

function EnemyDef(data) {
	this.name = data.name || "Enemy";
	this.displayName = data.displayName || "Enemy";
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

	this.def = null;

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
		this.level = EnemyManager.curArea.getLevel(EnemyManager.subArea);

		var lev = this.level / 3;
		var powerMult = (lev + 0.5) / 1.5;
		var rewardMult = lev;

		this.def = def;
		this.maxHealth = Math.floor(def.health * powerMult);
		this.health = this.maxHealth;
		this.attack = Math.floor(def.attack * powerMult);

		this.xp = Math.ceil(def.xp * Math.pow(rewardMult, 1.6));
		this.gold = Math.ceil(rand(0.5, 1.0) * def.gold * Math.pow(rewardMult, 1.9));
		this.forge = Math.ceil(def.forge * Math.pow(rewardMult, 0.8));

		var sel = this.getSelector();

		sel.find('.enemy').attr('src', def.image);
		sel.find('.name').text('L' + this.level + ' ' + def.displayName);

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

			this.takeDamage(Player.getDamageInfo());
		}
	};

	this.takeDamage = function(damageInfo) {
		this.health -= damageInfo.damage;

		var sel = this.getSelector();
		var width = sel.width();
		var height = sel.height();

		var pos = this.getAbsolutePosition();
		var x = pos.x + randInt(-40, 40) + width / 2;
		var y = pos.y + randInt(-20, 0) + height / 2;
		var dmgString = formatNumber(damageInfo.damage);
		if (damageInfo.isCrit) {
			ParticleContainer.create(critParticleType, dmgString + '!', x, y);
		}
		else {
			ParticleContainer.create(damageParticleType, dmgString, x, y);
		}

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
		Player.forge += this.forge;

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
