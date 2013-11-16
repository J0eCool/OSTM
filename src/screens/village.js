Village = {
	toSave: ['buildings'],

	buildings: {},

	goldPerSecond: 0,
	partialGold: 0,

	init: function() {
		Village.buildings = loadBuildings();

		Village.setupButtons();
	},

	postLoad: function() {
		Player.refreshResourceProduction();
	},

	update: function() {
		Village.updateButtons();
	},

	setupButtons: function() {
		var sections = {};
		foreach (Village.buildings, function(building) {
			if (!sections[building.sectionName]) {
				sections[building.sectionName] = '';
			}
			sections[building.sectionName] += building.getButtonHtml();
		});
		
		var fullHtml = '';
		foreach (sections, function(html, name) {
			fullHtml += '<div><h3>' + name + '</h3>' + html + '</div>';
		});
		j('.village').html(fullHtml);
	},

	updateButtons: function() {
		foreach(Village.buildings, function(building) {
			building.updateButton();
		});
	},

	buyBuilding: function(bldName) {
		var building = Village.buildings[bldName];
		if (building.canAfford()) {
			Player[building.getCurrency()].amount -= building.getCost();

			if (!building.isResearched) {
				building.isResearched = true;
			}
			else {
				building.count += 1;
			}

			Player.refreshResourceProduction();
		}
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
		var button = ButtonManager.create({
			onclick: Village.buyBuilding.bind(Village).curry(this.name),
			contents: '<b id="name"></b> : <span id="count"></span><br><span id="cost"></span>',
			id: 'button'
		});

		var id = this.name + '-button';
		return '<div id="' + this.name + '-building">' +
			button.html() +
			' <span id="description"' + '"></span></div>';
	};

	this.updateButton = function() {
		var id = '#' + this.name + '-building';
		j(id, 'toggle', this.isVisible());
		j(id + ' #name', 'text', this.isResearched ? this.displayName : 'Research Building');
		j(id + ' #button', 'toggleClass', 'inactive', !this.canAfford());
		j(id + ' #count', 'text', formatNumber(this.count));
		j(id + ' #cost', 'html', formatNumber(this.getCost()) + ' ' + getIconHtml(this.getCurrency()));

		j(id + ' #description', 'html', this.isResearched ? this.description ? this.description :
			'+' + formatNumber(this.resourcePerSecond) + ' ' +
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
		return this.isResearched ? 'gold' : 'forge';
	};

	this.canAfford = function() {
		return Player[this.getCurrency()].amount >= this.getCost();
	};

	this.getProduction = function() {
		return this.resourcePerSecond;
	};
}