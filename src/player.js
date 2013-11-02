Player = {
	toSave: ['health', 'xp', 'gold', 'forge', 'weapon'],

	health: 100,
	partialHealth: 0, //health regen per-tick roundoff

	xp: 0,
	gold: 0,
	forge: 0,

	weapon: 'knife',
	armor: 2,
	randDamage: 0.3,

	stats: [],

	init: function() {
		var stats = loadStats();
		for (var key in stats) {
			this.stats.push(key);
			this[key] = stats[key];
			this.toSave.push(key);
		}

		this.createStatButtons();

		$("#stats").html(
			'<div>Level: <span id="stat-level"></span></div>' +
			'<div>' + getIconHtml('xp') + ': <span id="stat-xp"></span></div>' +
			'<div>' + getIconHtml('gold') + ': <span id="stat-gold"></span></div>' +
			'<div>' + getIconHtml('forge') + ': <span id="stat-forge"></span></div>' +
			'<br/>' +
			'<div>Damage : <span id="stat-damage"></span></div>' +
			'<div>Weapon : <span id="stat-weapon"></span></div>' +
			'<div>Armor : <span id="stat-armor"></span></div>' +
			'<br/>' +
			'<div>' + getIconHtml('forge') + ' per Second: <span id="stat-forge-second"></span></div>' +
			'<div>' + getIconHtml('gold') + ' per Second: <span id="stat-gold-second"></span></div>' +
			'<br/>' +
			'<div>Health Regen: <span id="stat-regen"></span></div>' +
			'<div>Damage Reduction: <span id="stat-reduction"></span></div>' +
			'<br/>'
		);

		this.updateStats();
	},

	update: function() {
		var dT = Game.normalDt / 1000;
		this.regenHealth(this.maxHealth.value() * this.healthRegen.value() * dT);

		$('#player-health').text(formatNumber(this.health) + ' / ' + formatNumber(this.maxHealth.value()))
			.css('width', this.health / this.maxHealth.value() * 100 + '%');

		this.updateStats();
		this.updateStatButtons();
	},

	updateStats: function() {
		$('#stat-level').text(formatNumber(Player.getLevel()));
		$('#stat-xp').text(formatNumber(Player.xp));
		$('#stat-gold').text(formatNumber(Player.gold));
		$('#stat-forge').text(formatNumber(Player.forge));

		$('#stat-damage').text(formatNumber(Player.getDamageLo()) + ' - ' + formatNumber(Player.getDamageHi()));
		var wep = Blacksmith.getWeapon(Player.weapon);
		$('#stat-weapon').text(wep.displayName);
		$('#stat-armor').text(formatNumber(Player.armor));

		$('#stat-forge-second').text(formatNumber(Inventory.forgePerSecond));
		$('#stat-gold-second').text(formatNumber(Village.goldPerSecond));

		$('#stat-regen').text('+' + formatNumber(this.maxHealth.value() * this.healthRegen.value()) + '/s');
		$('#stat-reduction').text(formatNumber(100 * (1 - this.defenseDamageMultiplier())) + '%');
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
		return this.strength.value() * Blacksmith.getWeapon(this.weapon).getDamage();
	},

	getDamageLo: function() {
		return Math.floor(this.getBaseDamage() * (1 - this.randDamage / 2));
	},

	getDamageHi: function() {
		return Math.floor(this.getBaseDamage() * (1 + this.randDamage / 2));
	},

	defenseDamageMultiplier: function() {
		var defScale = 28;
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

	createStatButtons: function() {
		var statHtml = '';
		for (var i = 0; i < this.stats.length; i++) {
			statHtml += this.getStat(i).getUpgradeButtonHtml() + '<br/>';
		}

		$('#stat-buttons').html(statHtml);
		this.updateStatButtons();
	},

	updateStatButtons: function() {
		for (var i = 0; i < this.stats.length; i++) {
			this.getStat(i).updateButton();
		}
	},

	statUpgradeBaseCost: function() {
		return Math.floor(Math.pow(this.getLevel() - 1, 1.7) * 1.5);
	}
};

function StatType(data) {
	this.toSave = ['level'];

	this.statName = data.statName || '';
	this.displayName = data.displayName || this.statName || '';
	this.minLevel = data.minLevel || 0;
	this.baseValue = data.baseValue || 0;
	this.levelValue = data.levelValue || 1;
	this.baseCost = data.baseCost || 0;
	this.levelCost = data.levelCost || 0;
	this.isPercent = data.isPercent || false;
	this.stringPostfix = data.stringPostfix || '';

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
	};

	this.getBaseValueAtLevel = data.getBaseValueAtLevel || function(level) {
		return this.baseValue + level * this.levelValue;
	};

	this.getStringPostfix = function() {
		return this.stringPostfix || (this.isPercent ? '%' : '');
	};

	this.stringValue = function() {
		return formatNumber(this.getBaseValue()) + this.getStringPostfix();
	};

	this.upgradeCost = function() {
		return Math.ceil(this.baseCost + Math.pow(this.level, 2.3) * this.levelCost) +
			Player.statUpgradeBaseCost();
	};

	this.upgradeValue = function() {
		return this.getBaseValueAtLevel(this.level + 1) -
			this.getBaseValueAtLevel(this.level);
	};

	this.stringUpgradeValue = function() {
		return formatNumber(this.upgradeValue()) + this.getStringPostfix();
	};

	this.canUpgrade = function() {
		return this.isPlayerMinLevel() && Player.xp >= this.upgradeCost();
	};

	this.tryUpgrade = function() {
		if (this.canUpgrade()) {
			Player.xp -= this.upgradeCost();
			this.level++;

			this.onUpgrade();

			Player.updateStatButtons();
			return true;
		}
		return false;
	};

	this.isPlayerMinLevel = function() {
		return this.minLevel <= Player.getLevel();
	};

	this.getUpgradeButtonHtml = function() {
		var htmlStr = this.displayName + ': <span id="amount"></span>' +
			'<br/><span id="upgrade">(+<span id="upgrade-amount"></span>) : ' +
			'<span id="cost"></span> ' + getIconHtml('xp') + '</span>';
		return getButtonHtml("Player.upgrade('" + this.statName + "')",
			htmlStr, 'stat-' + this.statName + '-button');
	};

	this.updateButton = function() {
		var id = '#stat-' + this.statName + '-button';
		$(id).toggleClass('inactive', !this.canUpgrade());
		$(id + ' #upgrade').toggle(this.isPlayerMinLevel());
		$(id + ' #amount').text(this.stringValue());
		$(id + ' #upgrade-amount').text(this.stringUpgradeValue());
		$(id + ' #cost').text(formatNumber(this.upgradeCost()));
	};

	this.onUpgrade = data.onUpgrade || function() {};
}