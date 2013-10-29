AdventureScreen = new ScreenContainer({
	classBase: 'adventure-screen',
	targetDiv: '.adventure',

	screens: [
		new ScreenDef({
			name: 'map-select',
			createHtml: mapSelectHtml
		}),
		new ScreenDef({
			name: 'field'
		}),
		new ScreenDef({
			name: 'store',
			html: getButtonHtml("AdventureScreen.setScreen('map-select')", 'Leave') +
				'<div class="recipes"></div>'
		})
	],

	adventures: {},

	preInit: function() {
		this.adventures = loadAdventures();
	},

	onScreenSet: function(name) {
		if (!this.isOpen('field') && name == 'field') {
			EnemyManager.resetField();
		}

		this.curScreen = name;
	}
});
AdventureScreen.toSave = ['adventures'];
AdventureScreen.update = function() {
	$('#map-button').toggle(this.hasBeat('adv0'));
	for (var i in this.adventures) {
		var adv = this.adventures[i];
		$('#' + adv.name + '-button').toggle(adv.isAvailable());
	}
};
AdventureScreen.getAdventure = function(name) {
	for (var i in this.adventures) {
		var adv = this.adventures[i];
		if (adv.name == name) {
			return adv;
		}
	}

	return null;
};
AdventureScreen.hasBeat = function(name) {
	var adv = this.getAdventure(name);
	return adv && adv.hasBeat;
};
AdventureScreen.startAdventure = function(name) {
	var adv = this.getAdventure(name);
	EnemyManager.curArea = adv;
	this.setScreen('field');
};

function mapSelectHtml() {
	var html = getButtonHtml("AdventureScreen.setScreen('store')", "Store");
	for (var i in AdventureScreen.adventures) {
		var adv = AdventureScreen.adventures[i];
		html += ' ' + getButtonHtml("AdventureScreen.startAdventure('" + adv.name + "')",
			adv.displayName, adv.name + '-button');
	}
	return html;
}

function AdventureDef(data) {
	this.toSave = ['hasBeat'];
	this.name = data.name || '';
	this.displayName = data.displayName || '';
	this.levels = data.levels || [1];
	this.enemies = data.enemies || [];
	this.spawnCountLo = data.spawnCountLo || 3;
	this.spawnCountHi = data.spawnCountHi || 5;
	this.prereq = data.prereq || null;

	this.hasBeat = false;

	this.isAvailable = function() {
		return !this.prereq || AdventureScreen.hasBeat(this.prereq);
	};
}