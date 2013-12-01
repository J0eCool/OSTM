var AdventureScreen = new ScreenContainer({
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
		// new ScreenDef({
		// 	name: 'inn',
		// 	displayName: 'Inn',
		// 	html: getButtonHtml("AdventureScreen.setScreen('map-select')", 'Leave') + '<br>' +
		// 		getButtonHtml("AdventureScreen.useInn()", 'Rest: <span id="inn-cost"></span>' +
		// 			getIconHtml('gold'))
		// }),
		new ScreenDef({
			name: 'store',
			displayName: 'Store',
			html: getButtonHtml("AdventureScreen.setScreen('map-select')", 'Leave') +
				'<br><div class="recipes"></div>',
			adventuresBlock: true,
			prereqs: {
				adventures: ['adv1']
			}
		}),
		new ScreenDef({
			name: 'shrine',
			displayName: 'Shrine',
			createHtml: shrineHtml
		})
	],

	adventures: {},

	preInit: function() {
		this.adventures = loadAdventures();
	},

	update: function() {
		j('#shrine-button', 'toggle', this.hasBeat('adv2'));
		j('#inn-cost', 'text', formatNumber(this.getInnCost()));

		for (var i in this.adventures) {
			this.adventures[i].update();
		}
	},

	onScreenSet: function(name) {
		if (!this.isOpen('field') && name == 'field') {
			EnemyManager.resetField();
		}

		this.curScreen = name;
	}
});
AdventureScreen.toSave = ['adventures'];
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
	return adv && adv.beatOnPower >= 0;
};
AdventureScreen.startAdventure = function(name) {
	var adv = this.getAdventure(name);
	if (EnemyManager.curArea) {
		j('.field').toggleClass(EnemyManager.curArea.areaType, false);
	}
	j('.field').toggleClass(adv.areaType, true);
	EnemyManager.curArea = adv;
	this.setScreen('field');
};
AdventureScreen.increasePower = function(name) {
	var adv = this.getAdventure(name);
	Player.spend('research', adv.powerUpCost(), function() {
		adv.power++;
	});
};
AdventureScreen.decreasePower = function(name) {
	var adv = this.getAdventure(name);
	if (adv.power > 0) {
		adv.power--;
	}
};
AdventureScreen.useInn = function() {
	if (Player.health < Player.getMaxHealth() || Player.mana < Player.getMaxMana()) {
		Player.spend('gold', this.getInnCost(), function() {
			Player.health = Player.getMaxHealth();
			Player.mana = Player.getMaxMana();
		});
	}
};
AdventureScreen.getInnCost = function() {
	var l = Player.getLevel() - 1;
	return Math.floor(10 + l + 0.05 * Math.pow(l, 2.2));
};
AdventureScreen.isAdventuring = function() {
	return this.curScreen == 'field';
};

function AdventureDef(data) {
	this.toSave = ['beatOnPower', 'power'];
	this.prereqs = data.prereqs || null;
	this.name = data.name || '';
	this.displayName = data.displayName || '';
	this.areaType = data.areaType || 'grass';
	this.subAreas = data.subAreas || [{
		// This object serving as an example; don't actually default this
		level: 2,
		levelRand: 1,
		spawnLo: 3,
		spawnHi: 5,
		useAll: true,
		enemies: {
			'enemy': 100
		}
	}];
	this.allEnemies = data.allEnemies || {};
	this.allLevelRand = data.allLevelRand || 0;
	this.spawnCountLo = data.spawnCountLo || 3;
	this.spawnCountHi = data.spawnCountHi || 5;

	this.beatOnPower = -1;
	this.power = 0;

	var powerCap = 20;

	this.postLoad = function() {
		this.power = Math.min(this.power, powerCap);
	};

	this.update = function() {
		var id = '#' + this.name + '-button';
		var powId = '#' + this.name + '-power';

		j(id, 'toggle', this.isAvailable());
		j(powId, 'toggle', this.isAvailable());
		if (this.isAvailable()) {
			j(id, 'toggleClass', 'selected', this.power <= this.beatOnPower);
			j(powId + '-count', 'text', formatNumber(this.getMaxLevel()));
			j(powId + '-dec', 'toggle', this.power > 0);
			j(powId + '-inc', 'toggle', this.canIncreasePower());
			j(powId + '-inc-cost', 'text', formatNumber(this.powerUpCost()));
		}
	};

	this.isAvailable = function() {
		return prereqsMet(this.prereqs);
	};

	this.canIncreasePower = function() {
		return this.power <= this.beatOnPower && this.power < powerCap;
	};

	this.subUseAll = function(areaIndex) {
		var subArea = this.subAreas[areaIndex];
		return subArea.useAll === undefined || subArea.useAll;
	};

	this.getLevelHi = function(areaIndex) {
		var subArea = this.subAreas[areaIndex];
		var rand = (this.subUseAll(areaIndex) ? this.allLevelrand : subArea.levelRand) || 0;
		return subArea.level + rand;
	};

	this.getRandomLevel = function(areaIndex) {
		var subArea = this.subAreas[areaIndex];
		var diff = this.getBaseMaxLevel() - randIntInc(subArea.level, this.getLevelHi(areaIndex));

		return this.getMaxLevel() - diff;
	};

	this.getRandomEnemy = function(areaIndex) {
		var possibles = [];
		var weights = [];
		var totalWeight = 0;
		var subArea = this.subAreas[areaIndex];

		if (this.subUseAll(areaIndex)) {
			foreach (this.allEnemies, function(weight, name) {
				possibles.push(name);
				weights.push(weight);
				totalWeight += weight;
			});
		}
		foreach (subArea.enemies, function(weight, name) {
			possibles.push(name);
			weights.push(weight);
			totalWeight += weight;
		});

		var roll = rand(0, totalWeight);
		var i = 0;
		while (i < possibles.length && roll > weights[i]) {
			roll -= weights[i];
			i++;
		}
		return possibles[i];
	};

	this.getRandomSpawnCount = function(areaIndex) {
		var subArea = this.subAreas[areaIndex];
		if (this.subUseAll(areaIndex) || !subArea.spawnLo) {
			return randIntInc(this.spawnCountLo, this.spawnCountHi);
		}
		return randIntInc(subArea.spawnLo, subArea.spawnHi);
	};

	this.getBaseMaxLevel = function() {
		var max = 0;
		for (var i = 0; i < this.subAreas.length; i++) {
			max = Math.max(max, this.getLevelHi(i));
		}
		return max;
	};

	this.getMaxLevel = function() {
		return Math.ceil(this.getBaseMaxLevel() * Math.pow(1.2, this.power));
	};

	this.powerUpCost = function() {
		return Math.floor(50 * Math.pow(this.getMaxLevel(), 1.15));
	};
}

function mapSelectHtml() {
	var html = '';
	foreach (AdventureScreen.screens, function(scr) {
		if (scr.name != 'field' && scr.name != 'map-select') {
			html += getButtonHtml("AdventureScreen.setScreen('" + scr.name + "')",
				scr.displayName, scr.name + '-button') + ' ';
		}
	});
	html += '<br>';
	foreach (AdventureScreen.adventures, function (adv) {
		html += getButtonHtml("AdventureScreen.startAdventure('" + adv.name + "')",
			adv.displayName, adv.name + '-button') + ' ';
	});
	return html;
}

function shrineHtml() {
	var html = getButtonHtml("AdventureScreen.setScreen('map-select')", 'Leave');
	for (var key in AdventureScreen.adventures) {
		var adv = AdventureScreen.adventures[key];
		var id = adv.name + '-power';
		html += '<div id="' + id + '">' +
			getButtonHtml("AdventureScreen.decreasePower('" + adv.name + "')",
				'Decrease Power', id + '-dec') +
			' <span>' + adv.displayName + ' : Max enemy Level <span id="' + id + '-count"></span></span> ' +
			getButtonHtml("AdventureScreen.increasePower('" + adv.name + "')",
				'Increase Power<br><span id="' + id + '-inc-cost"></span>' +
				getIconHtml('research'), id + '-inc') +
			'</div>';
	}
	return html;
}
