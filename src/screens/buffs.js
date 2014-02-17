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
	this.level = 1;
	this.secondsActivated = 0;
	this.activatedPartial = 0;

	this.getButtonHtml = function() {
		return '<div class="buff-container" id="' + this.name + '"><b>' + this.displayName + '</b> ' +
			getButtonHtml("Buffs.activateBuff('" + this.name + "')",
				'+10 Minutes<br>1,000 ' + getIconHtml('research'), 'button', 'research') +
			'<div id="buff-desc"><ul><li id="level"></li><li id="effect"></li>' +
			'<li id="xpBar"><span id="xpBar-foreground"></span><span id="xpBar-text"></span></li>' +
			'<li id="timeleft"></li></ul></div></div>';
	};

	this.update = function() {
		if (this.isActivated()) {
			this.activatedPartial += Game.dT;
			var whole = Math.floor(this.activatedPartial);
			this.activatedPartial -= whole;
			this.secondsActivated += whole;

			if (this.secondsActivated >= this.toNextLevel()) {
				this.secondsActivated -= this.toNextLevel();
				this.level++;
				Player.refreshResourceProduction();
			}

			this.secondsLeft -= whole;
			if (this.secondsLeft <= 0) {
				this.secondsLeft = 0;
				Player.refreshResourceProduction();
			}
		}
		this.updateButton();
	};

	this.updateButton = function() {
		var id = '.buff-container#' + this.name;
		j(id + ' #level', 'text', 'Level: ' + this.level);
		j(id + ' #button', 'toggleClass', 'inactive', !Player.canSpend('research', 1000));
		j(id + ' #xpBar-text', 'text', 'Next Level: ' + formatTime(this.toNextLevel() - this.secondsActivated));
		j(id + ' #xpBar-foreground', 'toggleClass', 'selected', this.isActivated());
		j(id + ' #xpBar-foreground', 'css', 'width', this.secondsActivated / this.toNextLevel() * 100 + '%');

		var timeStr = '';
		if (this.secondsLeft > 0) {
			timeStr = 'Time Left: ' + formatTime(this.secondsLeft);
		}
		j(id + ' #timeleft', 'text', timeStr);

		var effectStr = '';
		for (var name in this.effects) {
			effectStr += getUpgradeName(name) + ': +' + this.getBonus(name) + '%';
		}
		j(id + ' #effect', 'text', effectStr);
	};

	this.activate = function() {
		if (Player.spend('research', 1000)) {
			this.secondsLeft += 600;
			Player.refreshResourceProduction();
		}
	};

	this.isActivated = function() {
		return this.secondsLeft > 0;
	};

	this.getBonus = function(name) {
		var effect = this.effects[name];
		if (!effect) {
			return 0;
		}
		return effect.base + (this.level - 1) * effect.level;
	};

	this.toNextLevel = function() {
		return 150 * this.level * (this.level + 1);
	};
}