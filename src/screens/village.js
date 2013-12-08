var Village = {
	toSave: ['buildings', 'upgrades'],

	buildings: {},
	upgrades: {},

	init: function() {
		this.buildings = loadBuildings();
		this.upgrades = loadUpgrades();

		this.setupButtons();
	},

	postLoad: function() {
		Player.refreshResourceProduction();
	},

	update: function() {
		this.updateButtons();
	},

	setupButtons: function() {
		var sections = {};
		foreach (this.buildings, function(building) {
			if (!sections[building.sectionName]) {
				sections[building.sectionName] = '';
			}
			sections[building.sectionName] += building.getButtonHtml();
		});
		sections.Upgrades = '';
		foreach (this.upgrades, function(upgrade) {
			sections.Upgrades += upgrade.getButtonHtml();
		});
		
		var fullHtml = '';
		foreach (sections, function(html, name) {
			fullHtml += '<div><h3>' + name + '</h3>' + html + '</div>';
		});
		j('.village').html(fullHtml);
	},

	updateButtons: function() {
		foreach (this.buildings, function(building) {
			building.updateButton();
		});
		foreach (this.upgrades, function(upgrade) {
			upgrade.updateButton();
		});
	},

	buy: function(type, name) {
		var item = this[type][name];
		if (Player.spend(item.getCurrency(), item.getCost())) {
			if (!item.isResearched) {
				item.isResearched = true;
			}
			else {
				item.count += 1;
			}

			Player.refreshResourceProduction();
		}
	},

	buyBuilding: function(bldName) {
		this.buy('buildings', bldName);
	},

	buyUpgrade: function(upgName) {
		this.buy('upgrades', upgName);
	}
};

function BuildingDef(data) {
	this.toSave = ['count', 'isResearched'];

	this.name = data.name || '';
	this.displayName = data.displayName || '';
	this.description = data.description || '';
	this.baseCost = data.baseCost || 10000;
	this.costIncreasePercent = data.costIncreasePercent || 10;
	this.researchCost = data.researchCost || 0;
	this.prereqs = data.prereqs || null;
	this.maxCount = data.maxCount || 0;

	this.resourceProduced = data.resourceProduced || 'gold';
	this.resourcePerSecond = data.resourcePerSecond || 0;

	this.count = 0;
	this.isResearched = this.researchCost === 0 || false;

	this.getButtonHtml = function() {
		var id = this.name + '-button';
		return '<div id="' + this.name + '-building">' +
			getButtonHtml("Village.buyBuilding('" + this.name + "')",
				'<b id="name"></b><span id="count"></span><br><span id="cost"></span>',
				'button') +
			' <span id="description"' + '"></span></div>';
	};

	this.updateButton = function() {
		var id = '#' + this.name + '-building';
		j(id, 'toggle', this.isVisible());
		j(id + ' #name', 'text', this.isResearched ? this.displayName : 'Research ' + this.displayName);

		var buttonClass = 'button ' + this.getCurrency();
		if (!this.canAfford()) {
			buttonClass += ' inactive';
		}
		j(id + ' #button', 'attr', 'class', buttonClass);

		j(id + ' #count', 'text', this.isResearched ? ': ' + formatNumber(this.count) : '');
		j(id + ' #cost', 'html', formatNumber(this.getCost()) + ' ' + getIconHtml(this.getCurrency()));

		j(id + ' #description', 'html', this.isResearched ? this.description ? this.description :
			'+' + formatNumber(this.getProduction()) + ' ' +
			getIconHtml(this.resourceProduced) + '/s' : '');
	};

	this.isVisible = function() {
		return (this.isResearched || canResearch()) &&
			prereqsMet(this.prereqs) &&
			(!this.maxCount || this.count < this.maxCount);
	};

	this.getCost = function() {
		if (!this.isResearched) {
			return this.researchCost;
		}
		return Math.ceil(this.baseCost * Math.pow(1 + this.costIncreasePercent / 100, this.count));
	};

	this.getCurrency = function() {
		return this.isResearched ? 'gold' : 'research';
	};

	this.canAfford = function() {
		return Player.canSpend(this.getCurrency(), this.getCost());
	};

	this.getProduction = function() {
		var base = this.resourcePerSecond;
		var name = this.name;
		foreach (Village.upgrades, function(upgrade) {
			if (upgrade.count > 0 && name == upgrade.targetBuilding) {
				base = upgrade.apply(base);
			}
		});
		return base;
	};
}

function UpgradeDef(data) {
	this.toSave = ['count', 'isResearched'];

	this.name = data.name || '';
	this.displayName = data.displayName || '';
	this.description = data.description || '';
	this.baseCost = data.baseCost || 10000;
	this.costIncreasePercent = data.costIncreasePercent || 15;
	this.researchCost = data.researchCost || 0;
	this.prereqs = data.prereqs || null;
	this.maxCount = data.maxCount !== undefined ? data.maxCount : 1;

	this.targetBuilding = data.targetBuilding || '';
	this.amountIncrease = data.amountIncrease || 0;

	this.count = 0;
	this.isResearched = this.researchCost === 0 || false;

	this.getButtonHtml = function() {
		var id = this.name + '-button';
		return '<div id="' + this.name + '-building">' +
			getButtonHtml("Village.buyUpgrade('" + this.name + "')",
				'<b id="name"></b><br><span id="cost"></span>',
				'button') +
			' <span id="description"' + '"></span></div>';
	};

	this.updateButton = function() {
		var id = '#' + this.name + '-building';
		j(id, 'toggle', this.isVisible());
		j(id + ' #name', 'text', this.isResearched ? this.displayName : 'Research ' + this.displayName);

		var buttonClass = 'button ' + this.getCurrency();
		if (!this.canAfford()) {
			buttonClass += ' inactive';
		}
		j(id + ' #button', 'attr', 'class', buttonClass);

		j(id + ' #cost', 'html', formatNumber(this.getCost()) + ' ' + getIconHtml(this.getCurrency()));

		j(id + ' #description', 'html', this.isResearched ? this.description ? this.description :
			Village.buildings[this.targetBuilding].displayName + ' +' + formatNumber(this.amountIncrease) + '%' : '');
	};

	this.isVisible = function() {
		return (this.isResearched || canResearch()) &&
			Player.wood.unlocked &&
			prereqsMet(this.prereqs) &&
			(!this.maxCount || this.count < this.maxCount);
	};

	this.getCost = function() {
		if (!this.isResearched) {
			return this.researchCost;
		}
		return Math.ceil(this.baseCost * Math.pow(1 + this.costIncreasePercent / 100, this.count));
	};

	this.getCurrency = function() {
		return this.isResearched ? 'wood' : 'research';
	};

	this.canAfford = function() {
		return Player.canSpend(this.getCurrency(), this.getCost());
	};

	this.apply = data.apply || function(base) {
		return (1 + this.amountIncrease * this.count / 100) * base;
	};
}