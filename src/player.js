Player = {
	maxHealth: new StatType({
		statName: 'Health',
		baseCost: 5,
		levelCost: 2.5,
		baseValue: 100,
		levelValue: 10,

		getBaseValueAtLevel: function(level) {
			return this.baseValue + level * (this.levelValue + level - 1);
		},
	}),
	health: 100,

	healthRegen: new StatType ({
		statName: 'Health Regen',
		minLevel: 30,
		baseCost: 1000,
		levelCost: 750,
		baseValue: 2.5,
		levelValue: 0.25,
		isPercent: true
	}),
	healthClickRegen: new StatType({
		statName: 'Heal Percent',
		minLevel: 10,
		baseCost: 100,
		levelCost: 800,
		baseValue: 2,
		levelValue: 0.5,
		isPercent: true
	}),
	partialHealth: 0, //health regen per-tick roundoff

	xp: 0,
	gold: 0,

	strength: new StatType({
		statName: 'Strength',
		minLevel: 2,
		baseCost: 10,
		levelCost: 5,
		baseValue: 4
	}),
	defense: new StatType({
		statName: 'Defense',
		minLevel: 5,
		baseCost: 25,
		levelCost: 5,
		baseValue: 3
	}),

	weaponDamage: 2,
	armor: 2,
	randDamage: 0.3,

	stats: ['maxHealth', 'strength', 'defense', 'healthRegen', 'healthClickRegen'],

	init: function() {
		this.health = this.maxHealth.value();
		this.updateStatButtons();

		$("#stats").html('Level: ' + Player.getLevel()
			+ '<div>' + getIconHtml('xp') + ': <span id="stat-xp"></span></div>'
			+ '<div>' + getIconHtml('gold') + ': <span id="stat-gold"></span></div>'
			+ '<div>Damage : <span id="stat-damage"></span></div>'
		);

		this.updateStats();
	},

	update: function() {
		var dT = Game.normalDt / 1000;
		this.regenHealth(this.maxHealth.value() * this.healthRegen.value() * dT);

		$('#player-health').text(formatNumber(this.health) + ' / ' + formatNumber(this.maxHealth.value()))
			.css('width', this.health / this.maxHealth.value() * 100 + '%');

		this.updateStats();
	},

	updateStats: function() {
		$('#stat-xp').text(formatNumber(Player.xp));
		$('#stat-gold').text(formatNumber(Player.gold));
		$('#stat-damage').text(formatNumber(Player.getDamageLo()) + ' - ' + formatNumber(Player.getDamageHi()));
	},

	getStat: function(i) {
		return this[this.stats[i]];
	},

	getLevel: function() {
		var level = 1;
		for (var i = 0; i < this.stats.length; i++) {
			level += this.getStat(i).level;
		}
		return level;
	},

	healthPlusClicked: function() {
		var toRestore = this.maxHealth.value() * this.healthClickRegen.value();
		var restored = this.regenHealth(toRestore);

		var button = $('.health-button');
		var pos = button.position();
		var width = button.width();
		var height = button.height();
		var x = pos.left + randInt(10, width - 10);
		var y = pos.top + randInt(-10, 0) + height / 2;
		ParticleContainer.create(healParticleType, '+' + restored, x, y);
	},

	regenHealth: function(amount) {
		this.partialHealth += amount;
		var restored = Math.floor(this.partialHealth);
		this.partialHealth -= restored;
		this.health = Math.min(this.health + restored, this.maxHealth.value());

		return restored;
	},

	addHealth: function(amount) {
		this.regenHealth(amount);
		this.createAddHealthParticle(amount);
	},

	getRandomDamage: function() {
		return randIntInc(this.getDamageLo(), this.getDamageHi());
	},

	getBaseDamage: function() {
		return this.strength.value() * this.weaponDamage;
	},

	getDamageLo: function() {
		return Math.floor(this.getBaseDamage() * (1 - this.randDamage / 2));
	},

	getDamageHi: function() {
		return Math.floor(this.getBaseDamage() * (1 + this.randDamage / 2));
	},

	defenseDamageMultiplier: function() {
		var defScale = 35;
		return defScale / (defScale + this.defense.value());
	},

	takeDamage: function(damage) {
		var modifiedDamage = Math.ceil(damage * this.defenseDamageMultiplier()) - this.armor;
		modifiedDamage = Math.max(modifiedDamage, 1);
		if (modifiedDamage >= this.health) {
			return false;
		}

		this.health -= modifiedDamage;
		this.createAddHealthParticle(-modifiedDamage);

		return true;
	},

	createAddHealthParticle: function(healthAmt) {
		var healthBar = $('#player-health');
		var pos = healthBar.position();
		var width = healthBar.width();
		var height = healthBar.height();
		var x = pos.left + width - 8;
		var y = pos.top + height / 2;

		var particleType = healthAmt > 0 ? healParticleType : playerDamageParticleType;
		var sign = healthAmt > 0 ? '+' : '';

		ParticleContainer.create(particleType, sign + formatNumber(healthAmt), x, y);
	},

	upgrade: function(statName) {
		for (var i = 0; i < this.stats.length; i++) {
			var stat = this.getStat(i);
			if (stat.statName == statName) {
				stat.tryUpgrade();
			}
		}
	},

	updateStatButtons: function() {
		var statHtml = '';
		for (var i = 0; i < this.stats.length; i++) {
			if (this.getStat(i).minLevel <= this.getLevel()) {
				statHtml += '<div>' + this.getStat(i).getUpgradeButtonHtml() + '</div>';
			}
		}

		$('#stat-buttons').html(statHtml);
	}
}

function StatType(data) {
	this.statName = data.statName || '';
	this.minLevel = data.minLevel || 1;
	this.baseValue = data.baseValue || 4;
	this.levelValue = data.levelValue || 1;
	this.baseCost = data.baseCost || 0;
	this.levelCost = data.levelCost || 0;
	this.isPercent = data.isPercent || false;

	this.level = 0;

	this.value = function() {
		var val = this.getBaseValue();
		if (this.isPercent) {
			val *= 0.01;
		}
		return val;
	};

	this.getBaseValue = function() {
		return this.getBaseValueAtLevel(this.level);
	}

	this.getBaseValueAtLevel = data.getBaseValueAtLevel || function(level) {
		return this.baseValue + level * this.levelValue;
	}

	this.stringValue = function() {
		return formatNumber(this.getBaseValue()) + (this.isPercent ? "%" : "");
	};

	this.upgradeCost = function() {
		return Math.ceil(this.baseCost + Math.pow(this.level, 2) * this.levelCost);
	};

	this.upgradeValue = function() {
		return this.getBaseValueAtLevel(this.level + 1)
			- this.getBaseValueAtLevel(this.level);
	};

	this.stringUpgradeValue = function() {
		return formatNumber(this.upgradeValue()) + (this.isPercent ? "%" : "");
	}

	this.tryUpgrade = function() {
		var cost = this.upgradeCost();
		if (Player.xp >= cost) {
			Player.xp -= cost;
			this.level++;

			Player.updateStatButtons();
			return true;
		}
		return false;
	};

	this.getUpgradeButtonHtml = function() {
		return '<button onClick="Player.upgrade(\'' + this.statName + '\')">'
			+ this.statName + ': ' + this.stringValue() + '<br />'
			+ '(+' + this.stringUpgradeValue() + ') : '
			+ formatNumber(this.upgradeCost()) + ' '
			+ getIconHtml('xp') + '</button>';
	}
}