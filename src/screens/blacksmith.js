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
		$('.blacksmith').html(html);

		this.updateButtons();
	},

	updateButtons: function() {
		if (AdventureScreen.hasBeat('adv2')) {
			$('#blacksmith-button').show();
			foreach(this.weapons, function(weapon) {
				weapon.updateButton();
			});
		}
	},

	getWeapon: function(wepName) {
		return this.weapons[wepName];
	},

	equip: function(wepName) {
		if (this.getWeapon(wepName).owned) {
			Player.weapon = wepName;
		}
	},

	tryPurchase: function(wepName) {
		var weapon = this.getWeapon(wepName);
		var cost = weapon.getCost();
		var currency = weapon.getCurrency();
		if (cost <= Player[currency]) {
			Player[currency] -= cost;
			weapon.purchase();
		}
	}
};

function WeaponDef(data) {
	this.toSave = ['owned', 'level', 'ascensions'];

	this.name = data.name || '';
	this.displayName = data.displayName || '';
	this.baseDamage = data.baseDamage || 2;
	this.ascendDamage = data.ascendDamage || 1;
	this.buyCost = data.buyCost || 1000;
	this.upgradeCost = data.upgradeCost || 75000;
	this.ascendCost = data.ascendCost || 5000;

	this.owned = data.owned || false;
	this.level = 0;
	this.ascensions = 0;

	this.getDamage = function() {
		return this.baseDamage + this.ascensions * this.ascendDamage;
	};

	this.getMaxLevel = function() {
		return 5 + this.ascensions;
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

		return Math.floor(this.upgradeCost * Math.pow(this.level + 1, 1.5) * (2 * this.ascensions + 1));
	};

	this.getCurrency = function() {
		if (!this.owned || !this.isMaxLevel()) {
			return 'gold';
		}
		//todo: currency progression
		return 'forge';
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
			getButtonHtml("Blacksmith.equip('" + this.name + "')", "Equip " + this.displayName, 'equip') +
			' ' + getButtonHtml("Blacksmith.tryPurchase('" + this.name + "')",
				'<span id="action"></span> ' + this.displayName + ' <span id="level"></span>' +
				'<br><span id="cost"></span>', 'button') +
			'<span id="description"></span>' +
			'</div>';
	};

	this.updateButton = function() {
		var container = $('.weapon-container#' + this.name);
		container.find('#equip').toggle(this.owned);

		var actionText = 'Buy';
		if (this.isMaxLevel()) {
			actionText = 'Ascend';
		}
		else if (this.owned) {
			actionText = 'Upgrade';
		}
		container.find('#action').text(actionText);

		var levelText = '';
		if (this.level > 0) {
			levelText += '(' + this.level + '/' + this.getMaxLevel() + ')';
		}
		if (this.ascensions > 0) {
			levelText = '+' + this.ascensions + ' ' + levelText;
		}
		container.find('#level').text(levelText);

		container.find('#cost').html(formatNumber(this.getCost()) + ' ' + getIconHtml(this.getCurrency()));

		var descriptionText = 'Damage: ' + this.getDamage();
		container.find('#description').text(descriptionText);
	};
}