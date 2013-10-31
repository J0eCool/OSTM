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
			html += building.getButtonHtml() + '<br>';
		});
		$('.village').html(html);
	},

	updateButtons: function() {
		if (AdventureScreen.hasBeat('adv1')) {
			$('#village-button').show();
			foreach(this.buildings, function(building) {
				building.updateButton();
			});
		}
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
		if (cost <= Player.gold) {
			Player.gold -= cost;
			building.count += 1;

			this.refreshGPS();
		}
	}
};

function BuildingDef(data) {
	this.toSave = ['count'];

	this.name = data.name || '';
	this.displayName = data.displayName || '';
	this.baseCost = data.baseCost || 10000;
	this.goldPerSecond = data.goldPerSecond || 15;

	this.count = 0;

	this.getButtonHtml = function() {
		var id = this.name + '-button';
		return getButtonHtml("Village.buyBuilding('" + this.name + "')",
			this.displayName + ' : <span id="' + id + '-count"></span><br><span id="' +
				id + '-cost"></span> ' + getIconHtml('gold'),
			this.name + '-button');
	};

	this.updateButton = function() {
		var id = '#' + this.name + '-button';
		//$(id).toggle();
		$(id + '-count').text(formatNumber(this.count));
		$(id + '-cost').text(formatNumber(this.getCost()));
	};

	this.getCost = function() {
		return Math.ceil(this.baseCost * Math.pow(1.1, this.count));
	};

	this.getGPS = function() {
		return this.goldPerSecond;
	};
}