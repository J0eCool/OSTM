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
			Player[weapon.getCurrency()] -= weapon.getCost();
			weapon.purchase();
			Player.weaponName = wepName;
		}
	}
};

function WeaponDef(data) {
	this.toSave = ['owned', 'level', 'ascensions'];

	this.name = data.name || '';
	this.displayName = data.displayName || '';
	this.damage = data.damage || 2;
	this.crit = data.crit || 5;
	this.ascendDamage = data.ascendDamage || 1;
	this.buyCost = data.buyCost || 1000;
	this.upgradeCost = data.upgradeCost || 75000;
	this.upgradeData = data.upgradeData || { 'damage': 10 };
	this.ascendCost = data.ascendCost || 5000;

	this.owned = data.owned || false;
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

	this.get = function(stat) {
		return this[stat] * (1 + this.getUpgradeAmount(stat) / 100);
	};

	this.getMaxLevel = function() {
		return 4 + this.ascensions;
	};

	this.isMaxLevel = function() {
		return this.level >= this.getMaxLevel();
	};

	this.getCost = function() {
		if (!this.owned) {
			return this.buyCost;
		}

		if (this.isMaxLevel()) {
			return this.ascendCost * Math.pow(this.ascensions + 1, 3);
		}

		return Math.floor(this.upgradeCost * Math.pow(this.level + 1, 0.5) * (2 * this.ascensions + 1));
	};

	this.getCurrency = function() {
		if (!this.owned || !this.isMaxLevel()) {
			return 'gold';
		}
		//todo: currency progression
		return 'forge';
	};

	this.canPurchase = function() {
		return !AdventureScreen.isAdventuring() &&
			Player[this.getCurrency()] >= this.getCost();
	};

	this.purchase = function() {
		if (!this.owned) {
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
				'<span id="action"></span> ' + this.displayName +
				'<br><span id="cost"></span>', 'button') +
			'<span id="description"></span>' +
			'</div>';
	};

	this.updateButton = function() {
		var id = '.weapon-container#' + this.name;
		var isEquipped = this.name == Player.weaponName;
		j(id + ' #equip', 'toggle', this.owned);
		j(id + ' #equip', 'toggleClass', 'inactive', AdventureScreen.isAdventuring() && !isEquipped);
		j(id + ' #equip', 'toggleClass', 'selected', isEquipped);

		var prereqs = null;
		if (this.owned) {
			prereqs = { buildings: { 'anvil': 1 } };
		}
		if (this.isMaxLevel()) {
			prereqs = { buildings: { 'forge': 1 } };
		}
		j(id + ' #button', 'toggle', prereqsMet(prereqs));
		j(id + ' #button', 'toggleClass', 'inactive', !this.canPurchase());

		var actionText = 'Buy';
		if (this.isMaxLevel()) {
			actionText = 'Ascend';
		}
		else if (this.owned) {
			actionText = 'Upgrade';
		}
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

		var descriptionText = 'Damage: ' + this.getBaseDamage() +
			' Base Crit: ' + this.crit + '%';
		for (var up in this.upgradeData) {
			descriptionText += ', ' + this.upgradeNames[up] + ': +' +
				this.getUpgradeAmount(up) + '%';
		}
		j(id + ' #description', 'text', descriptionText);
	};
}
WeaponDef.prototype.upgradeNames = {
	damage : 'Damage',
	crit : 'Crit. Chance',
	critDamage : 'Crit. Damage',
	defense : 'Defense'
};