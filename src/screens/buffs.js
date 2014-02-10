var Buffs = {
	toSave: ['buffs'],

	init: function() {
		this.buffs = loadBuffs();

		this.setupButtons();
	},

	setupButtons: function() {
		var html = getButtonHtml("AdventureScreen.setScreen('map-select')", 'Leave') + '<br>';
		foreach (this.buffs, function(buff) {
			html += buff.getButtonHtml();
		});
		j('.witch').html(html);
	},

	update: function() {
		foreach (this.buffs, function(buff) {
			buff.update();
		});
	},

	activateBuff: function(name) {
		if (this.buffs[name]) {
			this.buffs[name].activate();
		}
	},

	getMult: function(name) {
		var mult = 1;
		foreach (this.buffs, function(buff) {
			if (buff.isActivated()) {
				mult *= (1 + buff.getBonus(name) / 100);
			}
		});
		return mult;
	}
};

function BuffDef(data) {
	this.toSave = ['secondsLeft', 'level', 'secondsActivated'];

	this.name = data.name || '';
	this.displayName = data.displayName || '';

	this.effects = data.effects || {};

	this.secondsLeft = 0;
	this.level = 0;
	this.secondsActivated = 0;
	this.activatedPartial = 0;

	this.getButtonHtml = function() {
		return '<div class="buff-container" id="' + this.name + '">' +
			getButtonHtml("Buffs.activateBuff('" + this.name + "')",
				this.displayName, 'button') +
			'<span id="xp"></span></div>';
	};

	this.update = function() {
		if (this.isActivated()) {
			this.activatedPartial += Game.dT;
			var whole = Math.floor(this.activatedPartial);
			this.activatedPartial -= whole;
			this.secondsActivated += whole;
		}
		this.updateButton();
	};

	this.updateButton = function() {
		var id = '.buff-container#' + this.name;
		j(id + ' #button', 'toggleClass', 'selected', this.isActivated());
		j(id + ' #xp', 'text', this.secondsActivated);
	};

	this.activate = function() {
		this.secondsLeft = 1 - this.secondsLeft;
		Player.refreshResourceProduction();
	};

	this.isActivated = function() {
		return this.secondsLeft > 0;
	};

	this.getBonus = function(name) {
		var effect = this.effects[name];
		if (!effect) {
			return 0;
		}
		return effect.base + this.level * effect.level;
	};
}