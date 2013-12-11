var Blacksmith = {
	toSave: ['weapons'],

	weapons: {},

	init: function() {
		this.weapons = loadWeapons();

		this.setupButtons();
	},

	update: function() {
		this.updateButtons();
	},

	setupButtons: function() {
		var html = '';
		foreach(this.weapons, function(weapon) {
			html += weapon.getButtonHtml();
		});
		j('.blacksmith').html(html);

		this.updateButtons();
	},

	updateButtons: function() {
		foreach(this.weapons, function(weapon) {
			weapon.updateButton();
		});
	},

	getWeapon: function(wepName) {
		return this.weapons[wepName];
	},

	equip: function(wepName) {
		if (this.getWeapon(wepName).owned) {
			Player.weaponName = wepName;
		}
	},

	tryPurchase: function(wepName) {
		var weapon = this.getWeapon(wepName);
		if (weapon.canPurchase()) {
			Player.spend(weapon.getCurrency(), weapon.getCost(), function() {
				weapon.purchase();
				if (weapon.owned) {
					Player.weaponName = wepName;
				}
			});
		}
	}
};

function WeaponDef(data) {
	this.toSave = ['owned', 'researched', 'level', 'ascensions'];

	this.name = data.name || '';
	this.displayName = data.displayName || '';
	this.scalingBase = data.scalingBase || { strength: 50 };
	this.damage = data.damage || 2;
	this.crit = data.crit || 5;
	this.spellPower = data.spellPower || 0;
	this.ascendDamage = data.ascendDamage || 1;
	this.ascendSpellPower = data.ascendSpellPower || 1;
	this.buyCost = data.buyCost || 1000;
	this.researchCost = data.researchCost || 0;
	this.upgradeCost = (data.upgradeCostMult || 1) * 5000;
	this.upgradeData = data.upgradeData || { 'damage': 10 };
	this.ascendCost = (data.ascendCostMult || 1) * 500;
	this.prereqs = data.prereqs || null;

	this.owned = data.owned || false;
	this.researched = this.owned || this.researchCost <= 0;
	this.level = 0;
	this.ascensions = 0;

	this.getName = function() {
		if (this.ascensions > 0) {
			return this.displayName + ' +' + this.ascensions;
		}
		return this.displayName;
	};

	this.getUpgradeAmount = function(name) {
		var perLevel = this.upgradeData[name];
		if (!perLevel) {
			return 0;
		}
		return (this.level + 1) * perLevel;
	};

	this.getMult = function(name) {
		return 1 + this.getUpgradeAmount(name) / 100;
	};

	this.getBaseDamage = function() {
		return this.damage + this.ascensions * this.ascendDamage;
	};

	this.getBaseSpellPower = function() {
		if (!this.spellPower) {
			return 0;
		}
		return this.spellPower + this.ascensions * this.ascendSpellPower;
	};

	this.getTotalUpgradeCount = function() {
		// Sum of numbers from n to x = (x + n)*(x + n - 1)/2 - n*(n - 1)/2
		// aka: the sum from 1 to x minus the sum from 1 to n
		return this.level + (this.ascensions + 5) * (this.ascensions + 4) / 2 - 10;
	};

	this.getScaling = function(stat) {
		if (!this.scalingBase[stat]) {
			return 0;
		}
		return this.scalingBase[stat] * (1 + this.getTotalUpgradeCount() / 75);
	};

	this.getTotalScalingOfType = function(type) {
		var statMod = 1;
		var that = this;
		foreach (this.scalingBase, function(val, name) {
			if (Player[name] && getStatClass(name) === type) {
				statMod += Player[name].value() * that.getScaling(name) / 100;
			}
		});
		return statMod;
	};

	this.getDamage = function() {
		return this.getMult('damage') *
			this.getTotalScalingOfType('physical') *
			this.getBaseDamage();
	};

	this.getSpellPower = function() {
		return this.getMult('spellPower') *
			this.getTotalScalingOfType('mental') *
			this.getBaseSpellPower();
	};

	this.getBaseCrit = function() {
		return this.crit;
	};

	this.getMaxLevel = function() {
		return 4 + this.ascensions;
	};

	this.isMaxLevel = function() {
		return this.level >= this.getMaxLevel();
	};

	this.getCost = function() {
		if (!this.researched) {
			return this.researchCost;
		}

		if (!this.owned) {
			return this.buyCost;
		}

		if (this.isMaxLevel()) {
			return Math.floor(this.ascendCost * Math.pow(this.ascensions + 1, 3));
		}

		return Math.floor(this.upgradeCost * Math.pow(this.level + 1, 1.6 + this.ascensions * 0.2) * (this.ascensions * 0.2 + 1));
	};

	this.getCurrency = function() {
		if (!this.researched) {
			return 'research';
		}

		if (!this.owned || !this.isMaxLevel()) {
			return 'gold';
		}

		//todo: currency progression
		return 'iron';
	};

	this.canPurchase = function() {
		return Player.canSpend(this.getCurrency(), this.getCost());
	};

	this.purchase = function() {
		if (!this.researched) {
			this.researched = true;
		}
		else if (!this.owned) {
			this.owned = true;
		}
		else if (this.isMaxLevel()) {
			this.ascensions += 1;
			//this.level = Math.floor(this.getMaxLevel() / 2);
			this.level = 0;
		}
		else {
			this.level += 1;
		}
	};

	this.getButtonHtml = function() {
		return '<div class="weapon-container" id="' + this.name +
			'"><span id="name"></span>' +
			getButtonHtml("Blacksmith.equip('" + this.name + "')", 'Equip', 'equip') +
			' ' + getButtonHtml("Blacksmith.tryPurchase('" + this.name + "')",
				'<span id="action"></span>' +
				'<br><span id="cost"></span>', 'button') +
			'<div id="description"><span id="scaling"></span><span id="base">' +
			'</span><span id="upgrades"></span></div>' +
			'</div>';
	};

	this.updateButton = function() {
		var id = '.weapon-container#' + this.name;
		var isVisible = this.owned || prereqsMet(this.prereqs);
		j(id, 'toggle', isVisible);

		if (isVisible) {
			var isEquipped = this.name == Player.weaponName;
			j(id + ' #equip', 'toggle', this.owned);
			j(id + ' #equip', 'toggleClass', 'selected', isEquipped);

			var prereqs = null;
			if (this.isMaxLevel()) {
				prereqs = { buildings: { 'forge': 1 } };
			}
			else if (this.owned) {
				prereqs = { buildings: { 'anvil': 1 } };
			}
			j(id + ' #button', 'toggle', prereqsMet(prereqs));

			var buttonClass = 'button ' + this.getCurrency();
			if (!this.canPurchase()) {
				buttonClass += ' inactive';
			}
			j(id + ' #button', 'attr', 'class', buttonClass);

			var actionText = 'Buy';
			if (this.isMaxLevel()) {
				actionText = 'Ascend';
			}
			else if (this.owned) {
				actionText = 'Upgrade';
			}
			else if (!this.researched) {
				actionText = 'Research';
			}
			j(id + ' #action', 'text', actionText);

			var nameText = this.getName();
			if (this.level > 0) {
				nameText += ' (' + this.level + '/' + this.getMaxLevel() + ')';
			}
			j(id + ' #name', 'text', nameText);

			j(id + ' #cost', 'html', formatNumber(this.getCost()) +
				' ' + getIconHtml(this.getCurrency()));

			j(id + ' #description', 'toggle', this.researched);

			var scalingStr = '<ul>';
			for (var i = 0; i < Player.stats.length; i++) {
				var name = Player.stats[i];
				var stat = Player[name];
				var scaling = this.getScaling(name);
				if (stat && scaling) {
					scalingStr += '<li class="' + getStatClass(name) + '">' + stat.abbrev + ': ' +
						formatNumber(scaling, 1) + '%</li>';
				}
			}
			scalingStr += '</ul>';
			j(id + ' #scaling', 'html', scalingStr);
			var baseStr = '<ul><li class="physical">Attack: ' + formatNumber(this.getBaseDamage()) +
				'<li class="mental">Spell: ' + formatNumber(this.getBaseSpellPower()) + '</li>' +
				'</li><li>Base Crit: ' + formatNumber(this.crit) + '%</li>';
			baseStr += '</ul>';
			j(id + ' #base', 'html', baseStr);
			var upgradeStr = '<ul>';
			for (var up in this.upgradeData) {
				upgradeStr += '<li>' + getUpgradeName(up) + ': +' +
					formatNumber(this.getUpgradeAmount(up)) + '%</li>';
			}
			upgradeStr += '</ul>';
			j(id + ' #upgrades', 'html', upgradeStr);
		}
	};
}

var getUpgradeName = function() {
	var upgradeNames = {
		damage: 'Damage',
		maxDamage: 'Max Damage',
		crit: 'Crit. Chance',
		critDamage: 'Crit. Damage',
		defense: 'Defense',
		maxHealth: 'Max Health',
		healthRegen: 'Health Regen',
		maxMana: 'Max Mana',
		manaRegen: 'Mana Regen',
		spellPower: 'Spell Power',
		itemEffeciency: 'Item Efficiency',
	};
	return function(stat) {
		return upgradeNames[stat] || stat;
	};
}();

var getStatClass = function() {
	var physical = ['strength', 'dexterity'];
	var mental = ['intelligence', 'wisdom'];
	return function(stat) {
		if (physical.indexOf(stat) !== -1) {
			return 'physical';
		}
		if (mental.indexOf(stat) !== -1) {
			return 'mental';
		}
		return '';
	};
}();