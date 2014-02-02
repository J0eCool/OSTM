var Mastery = {
	toSave: ['weaponTypes'],

	weaponTypes: {},

	init: function() {
		this.weaponTypes = loadWeaponTypes();

		this.setupButtons();
	},

	update: function() {
		this.updateButtons();
	},

	setupButtons: function() {
		var html = '';
		foreach (this.weaponTypes, function(type) {
			html += type.getButtonHtml();
		});
		j('.mastery').html(html);

		this.updateButtons();
	},

	updateButtons: function() {
		foreach(this.weaponTypes, function(type) {
			type.updateButton();
		});
	}
};

function WeaponTypeDef(data) {
	this.toSave = ['xp', 'level'];

	this.name = data.name || '';
	this.displayName = data.displayName || '';
	this.upgradeData = merge(data.upgradeData || {}, {crit: 2});

	this.level = 0;
	this.xp = 0;

	this.addXp = function(amt) {
		this.xp += amt;
		while (this.xp >= this.getNextLevelXp()) {
			this.xp -= this.getNextLevelXp();
			this.level++;
		}
	};

	this.getNextLevelXp = function() {
		return this.getLevelXp(this.level);
	};

	this.getLevelXp = function(level) {
		return level * (1 + level) / 2 * 1000 + 10000;
	};

	this.getUpgradeAmount = function(name) {
		var perLevel = this.upgradeData[name];
		if (perLevel) {
			return (1 + this.level) * perLevel;
		}
		return 0;
	};

	this.getButtonHtml = function() {
		return '<div class="mastery-container" id="' + this.name +
			'"><div><span id="name">' + this.displayName + '</span> <span id="mastery-level"></span>' +
			'<div id="upgrades"></div></div>' +
			'<div id="xpBar"><span id="xpBar-foreground"></span><span id="xpBar-text"></span></div>' +
			'</div>';
	};

	this.updateButton = function() {
		var id = '.mastery-container#' + this.name;
		j(id + ' #mastery-level', 'text', 'L: ' + this.level);

		var upgradeHtml = '<ul>';
		for (var up in this.upgradeData) {
			upgradeHtml += '<li>' + getUpgradeName(up) + ': +' +
				formatNumber(this.getUpgradeAmount(up)) + '%</li>';
		}
		upgradeHtml += '</ul>';
		j(id + ' #upgrades', 'html', upgradeHtml);

		j(id + ' #xpBar-text', 'text', formatNumber(this.xp) +
			' / ' + formatNumber(this.getNextLevelXp()));
		j(id + ' #xpBar-foreground', 'width', 100 * this.xp / this.getNextLevelXp() + '%');
	};
}
