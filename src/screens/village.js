Village = {
	toSave: ['buildings'],

	buildings: {},

	goldPerSecond: 0,
	partialGold: 0,

	init: function() {
		this.buildings = loadBuildings();

		this.setupButtons();

		this.refreshGPS();
	},

	postLoad: function() {
		this.refreshGPS();
	},

	update: function() {
		this.updateButtons();

		// Update GpS
		var dT = Game.normalDt / 1000;
		this.partialGold += this.goldPerSecond * dT;
		var gold = Math.floor(this.partialGold);
		Player.gold += gold;
		this.partialGold -= gold;
	},

	setupButtons: function() {
		var html = '';
		foreach(this.buildings, function(building) {
			html += building.getButtonHtml();
		});
		j('.village').html(html);
	},

	updateButtons: function() {
		foreach(this.buildings, function(building) {
			building.updateButton();
		});
	},

	refreshGPS: function() {
		this.goldPerSecond = 0;
		foreach(this.buildings, function(building) {
			Village.goldPerSecond += building.count * building.getGPS();
		});
	},

	buyBuilding: function(bldName) {
		var building = this.buildings[bldName];
		var cost = building.getCost();
		var currency = building.getCurrency();
		if (cost <= Player[currency]) {
			Player[currency] -= cost;

			if (!building.isResearched) {
				building.isResearched = true;
			}
			else {
				building.count += 1;
			}

			this.refreshGPS();
		}
	}
};

function BuildingDef(data) {
	this.toSave = ['count'];

	this.name = data.name || '';
	this.displayName = data.displayName || '';
	this.description = data.description || '';
	this.baseCost = data.baseCost || 10000;
	this.researchCost = data.researchCost || 0;
	this.prereqs = data.prereqs || null;
	this.maxCount = data.maxCount || 0;

	this.goldPerSecond = data.goldPerSecond || 0;

	this.count = 0;
	this.isResearched = this.researchCost === 0 || false;

	this.getButtonHtml = function() {
		var id = this.name + '-button';
		return '<div id="' + this.name + '-building">' +
			getButtonHtml("Village.buyBuilding('" + this.name + "')",
				'<b id="name"></b> : <span id="count"></span><br><span id="cost"></span>',
				'button') +
			' <span id="description"' + '"></span></div>';
	};

	this.updateButton = function() {
		var id = '#' + this.name + '-building';
		j(id, 'toggle', this.isVisible());
		j(id + ' #name', 'text', this.isResearched ? this.displayName : 'Research Building');
		j(id + ' #button', 'toggleClass', 'inactive', Player.gold < this.getCost());
		j(id + ' #count', 'text', formatNumber(this.count));
		j(id + ' #cost', 'html', formatNumber(this.getCost()) + ' ' + getIconHtml(this.getCurrency()));

		j(id + ' #description', 'html', this.isResearched ? this.description ? this.description :
			'+' + this.goldPerSecond + ' ' + getIconHtml('gold') + '/s' : '');
	};

	this.isVisible = function() {
		return prereqsMet(this.prereqs) && (!this.maxCount || this.count < this.maxCount);
	};

	this.getCost = function() {
		if (!this.isResearched) {
			return this.researchCost;
		}
		return Math.ceil(this.baseCost * Math.pow(1.1, this.count));
	};

	this.getCurrency = function() {
		return this.isResearched ? 'gold' : 'forge';
	};

	this.getGPS = function() {
		return this.goldPerSecond;
	};
}