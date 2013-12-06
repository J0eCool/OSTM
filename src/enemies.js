var EnemyManager = {
	numEnemies: 9,
	enemyDefs: {},

	curArea: null,

	enemies: [],
	activeEnemies: [],
	jqField: null,
	jqAdventure: null,

	subArea: 0,
	bestAvailableSubArea: 0,

	getAppropriateEnemy: function() {
		return this.enemyDefs[this.curArea.getRandomEnemy(this.subArea)];
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

		fieldHtml += '<div class="spawn-area">';
		this.enemies = [];
		for (var i = 0; i < this.numEnemies; i++) {
			var enemy = new EnemyContainer(i);
			this.enemies.push(enemy);
			fieldHtml += enemy.getHtml();
		}
		fieldHtml += '</div>';

		this.jqField.html(fieldHtml);

		j(".enemy").click(function() {
			var index = $(this).attr('index');
			EnemyManager.enemies[index].onClick();
		});
	},

	update: function() {
		if (this.curArea && this.activeEnemies.length === 0) {
			this.bestAvailableSubArea = Math.max(this.subArea + 1, this.bestAvailableSubArea);
			if (this.bestAvailableSubArea >= this.curArea.subAreas.length) {
				this.curArea.beatOnPower = Math.max(this.curArea.power, this.curArea.beatOnPower);
			}
			this.updateHeaderButtons();
			this.spawnEnemies();
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
			this.curArea.getRandomSpawnCount(this.subArea));
		j('.enemy-container').hide();
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
	},

	updateUI: function() {
		this.updateHeaderButtons();
	},

	updateHeaderButtons: function() {
		j('#area-name', 'text', this.curArea.displayName);
		j('#dec-level', 'toggle', this.subArea > 0);
		j('#inc-level').toggle(this.subArea < this.bestAvailableSubArea)
			.find('.content').text((this.subArea + 1 < this.curArea.subAreas.length) ?
				'Forward' : 'Area Complete');
	},

	decreaseLevel: function() {
		this.subArea--;
		this.spawnEnemies();
		this.updateUI();
	},

	increaseLevel: function() {
		if (this.subArea + 1 < this.curArea.subAreas.length) {
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
	this.boss = data.boss || false;

	this.minLevel = data.minLevel || 0;

	this.health = data.health || 10;
	this.attack = data.attack || 5;

	this.reward = data.reward || {};
}

function EnemyContainer(index) {
	this.index = index;
	this.level = 0;

	this.def = null;

	this.health = 0;
	this.maxHealth = 0;
	this.attack = 0;

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
			this.selector = j('.enemy-container[index='+this.index+']');
		}
		return this.selector;
	};

	this.imgSelector = null;
	this.getImgSelector = function() {
		if (!this.imgSelector) {
			this.imgSelector = this.getSelector().find('.enemy');
		}
		return this.imgSelector;
	};

	this.isActive = function() {
		return EnemyManager.activeEnemies.indexOf(this) >= 0;
	};

	var calcReward = function() {
		var rewardScaling = {
			xp: function(b, s) { return b * Math.pow(s, 2); },
			gold: function(b, s) { return rand(0.35, 1) * b * Math.pow(s, 2); },
			research: function(b, s) { return b * Math.pow(s, 0.85); },
			iron: function(b, s) { return b * Math.pow(s, 1.4); },
			wood: function(b, s) { return b * Math.pow(s, 1.15); },
		};
		return function(reward, level) {
			var r = {};
			var scale = level * 0.3;
			for (var key in reward) {
				if (Player[key] && Player[key].unlocked) {
					if (key in rewardScaling) {
						r[key] = Math.ceil(rewardScaling[key](reward[key], scale));
					}
					else {
						r[key] = Math.ceil(reward[key] * scale);
					}
				}
			}

			if (Player.skill.unlocked) {
				r.skill = 5 + Math.floor(Math.pow(level, 0.65));
			}
			return r;
		};
	}();

	this.respawn = function(def) {
		this.level = EnemyManager.curArea.getRandomLevel(EnemyManager.subArea);

		var lev = this.level / 3;

		this.def = def;
		this.maxHealth = Math.floor(def.health * (1 + 0.5 * lev + 0.03 * Math.pow(lev, 2.7)));
		this.health = this.maxHealth;
		this.attack = Math.floor(def.attack * (1 + 0.35 * lev + 0.15 * Math.pow(lev, 1.9)));

		var sel = this.getSelector();
		var en = this.getImgSelector();

		en.attr('src', def.image)
			.toggleClass('boss', def.boss);
		sel.find('.name').text('L' + this.level + ' ' + def.displayName);

		var width = en.width();
		var height = width;//en.height();

		var spawn = j('.spawn-area');
		var spawnWidth = spawn.width();
		var spawnHeight = spawn.height();

		this.x = rand(0, spawnWidth - width) / spawnWidth;
		this.y = rand(0, spawnHeight - height) / spawnHeight;

		this.getSelector().css({
			'left': this.x * 100 + '%',
			'top': this.y * 100 + '%'
		});

		this.updateHealthBar();
		this.clearPosCache();
	};

	this.clearPosCache = function() {
		this.cachedRelPos = null;
		this.cachedAbsPos = null;
	};

	this.getRelativePosition = function() {
		if (!this.cachedRelPos) {
			var spawn = j('.spawn-area');
			var sel = this.getImgSelector();
			var pos = sel.position();
			this.cachedRelPos = {
				x: spawn.width() * this.x + pos.left,
				y: spawn.height() * this.y + pos.top,
				w: sel.width(),
				h: sel.height()
			};
		}
		return shallowClone(this.cachedRelPos);
	};

	this.getAbsolutePosition = function() {
		if (!this.cachedAbsPos) {
			var adventurePos = EnemyManager.jqAdventure.position();
			adventurePos.top = 64;
			var spawnPos = j('.spawn-area').position();
			var pos = this.getRelativePosition();
			this.cachedAbsPos = {
				x: adventurePos.left + spawnPos.left + pos.x,
				y: adventurePos.top + spawnPos.top + pos.y,
				w: pos.w,
				h: pos.h
			};
		}
		return shallowClone(this.cachedAbsPos);
	};

	this.attackPower = function() {
		return this.attack;
	};

	this.onClick = function() {
		Player.tryAttack(this);
	};

	this.takeDamage = function(damageInfo) {
		this.health -= damageInfo.damage;

		var dmgString = formatNumber(damageInfo.damage);
		if (damageInfo.isCrit) {
			this.showMessage(dmgString + '!', critParticleType);
		}
		else {
			this.showMessage(dmgString, damageParticleType);
		}

		var enemyImage = this.getImgSelector();
		if (this.health <= 0) {
			this.giveRewards();

			enemyImage.toggleClass('blur', false);

			EnemyManager.despawnEnemy(this);
		}
		else {
			this.animateHealthBar();

			if (Options.fancyGraphics) {
				enemyImage.toggleClass('blur', true)
					.one('transitionend', function(e) {
						enemyImage.toggleClass('blur', false);
					});
			}
		}
	};

	this.showMessage = function(message, particleType) {
		if (!particleType) {
			particleType = damageParticleType;
		}

		var pos = this.getAbsolutePosition();
		var x = pos.x + randInt(-40, 40) + pos.w / 2;
		var y = pos.y - 64 + randInt(-20, 20) + pos.h / 2;

		ParticleContainer.create(particleType, message, x, y);
	};

	this.getHealthPercent = function() {
		return clamp(this.health / this.maxHealth, 0, 1) * 100;
	};

	this.animateHealthBar = function() {
		var obj = j('.enemy-health-'+this.index)[0].style;
		var that = this;
		TimerManager.create(function() {
			var from = obj.width.split('%')[0] / 1;
			var to = that.getHealthPercent();
			return function(t) {
				obj.width = lerp(t, from, to) + '%';
			};
		}(), 125);
	};

	this.updateHealthBar = function() {
		j('.enemy-health-'+this.index).stop(true, true).css('width', this.getHealthPercent() + '%');		
	};

	this.giveRewards = function() {
		var reward = calcReward(this.def.reward, this.level);
		Player.giveResources(reward);

		var rewardString = '';
		// iterate over Player.resources to guarantee ordering
		for (var i = 0; i < Player.resources.length; i++) {
			var name = Player.resources[i];
			var amt = reward[name];
			if (amt > 0 && Options.showRewards[name]) {
				rewardString += '<span class="' + name + '-reward">' + getIconHtml(name) + ' ' +
					formatNumber(amt) + '</span><br>';
			}
		}

		var pos = this.getAbsolutePosition();
		ParticleContainer.create(rewardParticleType, rewardString, pos.x, pos.y);
	};

	this.handleResize = function(windowSize) {
		this.clearPosCache();
	};
}
