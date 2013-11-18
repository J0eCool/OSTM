Blacksmith = {
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
		if (this.getWeapon(wepName).owned && !AdventureScreen.isAdventuring()) {
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
	this.mainStat = data.mainStat || 'strength';
	this.damage = data.damage || 2;
	this.crit = data.crit || 5;
	this.ascendDamage = data.ascendDamage || 1;
	this.buyCost = data.buyCost || 1000;
	this.researchCost = data.researchCost || 0;
	this.upgradeCost = (data.upgradeCostMult || 1) * 75000;
	this.upgradeData = data.upgradeData || { 'damage': 10 };
	this.ascendCost = (data.ascendCostMult || 1) * 500;
	this.prereqs = data.prereqs || null;

	this.owned = data.owned || false;
	this.researched = this.owned || this.researchCost <= 0;
	this.level = 0;
	this.ascensions = 0;

	this.getUpgradeAmount = function(name) {
		var perLevel = this.upgradeData[name];
		if (!perLevel) {
			return 0;
		}
		return (this.level + 1) * perLevel;
	};

	this.getBaseDamage = function() {
		return this.damage + this.ascensions * this.ascendDamage;
	};

	this.getDamage = function() {
		var weaponDamage = this.getBaseDamage() * (1 + this.getUpgradeAmount('damage') / 100);
		var statMod = (Player.strength.value() + Player.dexterity.value()) / 2;
		statMod += Player[this.mainStat].value() / 2;
		return weaponDamage * statMod;
	};

	this.getCrit = function() {
		return this.crit * (1 + this.getUpgradeAmount('crit') / 100);
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
			return this.ascendCost * Math.pow(this.ascensions + 1, 3);
		}

		return Math.floor(this.upgradeCost * Math.pow(this.level + 1, 0.5) * (2 * this.ascensions + 1));
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
		return !AdventureScreen.isAdventuring() &&
			Player.canSpend(this.getCurrency(), this.getCost());
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
			this.level = 0;
		}
		else {
			this.level += 1;
		}
	};

	this.getButtonHtml = function() {
		return '<div class="weapon-container" id="' + this.name + '">' +
			getButtonHtml("Blacksmith.equip('" + this.name + "')", "Equip " +
				this.displayName + ' <span id="level"></span>', 'equip') +
			' ' + getButtonHtml("Blacksmith.tryPurchase('" + this.name + "')",
				'<span id="action"></span>' +
				'<br><span id="cost"></span>', 'button') +
			'<span id="description"></span>' +
			'</div>';
	};

	this.updateButton = function() {
		var id = '.weapon-container#' + this.name;
		var isVisible = this.owned || prereqsMet(this.prereqs);
		j(id, 'toggle', isVisible);

		if (isVisible) {
			var isEquipped = this.name == Player.weaponName;
			j(id + ' #equip', 'toggle', this.owned);
			j(id + ' #equip', 'toggleClass', 'inactive', AdventureScreen.isAdventuring() && !isEquipped);
			j(id + ' #equip', 'toggleClass', 'selected', isEquipped);

			var prereqs = null;
			if (this.owned) {
				prereqs = { buildings: { 'anvil': 1 } };
			}
			else if (this.isMaxLevel()) {
				prereqs = { buildings: { 'forge': 1 } };
			}
			j(id + ' #button', 'toggle', prereqsMet(prereqs));
			j(id + ' #button', 'toggleClass', 'inactive', !this.canPurchase());

			var actionText = 'Buy ';
			if (this.isMaxLevel()) {
				actionText = 'Ascend ';
			}
			else if (this.owned) {
				actionText = 'Upgrade ';
			}
			else if (!this.researched) {
				actionText = 'Research ';
			}
			actionText += this.displayName;
			j(id + ' #action', 'text', actionText);

			var levelText = '';
			if (this.level > 0) {
				levelText += '(' + this.level + '/' + this.getMaxLevel() + ')';
			}
			if (this.ascensions > 0) {
				levelText = '+' + this.ascensions + ' ' + levelText;
			}
			j(id + ' #level', 'text', levelText);

			j(id + ' #cost', 'html', formatNumber(this.getCost()) +
				' ' + getIconHtml(this.getCurrency()));

			j(id + ' #description', 'toggle', this.researched);
			var descriptionText ='';
			var stat = Player[this.mainStat];
			if (stat) {
				descriptionText += ' (' + stat.abbrev + ')';
			}
			descriptionText += ' Damage: ' + this.getBaseDamage() +
				' Base Crit: ' + this.crit + '%';
			descriptionText += '<i>';
			for (var up in this.upgradeData) {
				descriptionText += ', ' + this.upgradeNames[up] + ': +' +
					this.getUpgradeAmount(up) + '%';
			}
			descriptionText += '</i>';
			j(id + ' #description', 'html', descriptionText);
		}
	};
}
WeaponDef.prototype.upgradeNames = {
	damage : 'Damage',
	crit : 'Crit. Chance',
	critDamage : 'Crit. Damage',
	defense : 'Defense'
};