var Skills = {
	toSave: ['skills'],

	skills: {},

	init: function() {
		this.skills = loadSkills();

		this.setupButtons();
	},

	update: function() {
		this.updateButtons();
	},

	setupButtons: function() {
		var categoriedHtml = {};
		var html = '';
		var attackHtml = '';
		foreach (this.skills, function(skill) {
			if (!categoriedHtml[skill.category]) {
				categoriedHtml[skill.category] = '<h3>' + skill.category + '</h3>';
			}
			categoriedHtml[skill.category] += skill.getButtonHtml();

			if (skill.isAttack()) {
				attackHtml += skill.getAttackButtonHtml();
			}
		});
		foreach (categoriedHtml, function(str) {
			html += str;
		});
		j('.skills', 'html', html);
		j('.attacks', 'html', attackHtml);

		this.updateButtons();
	},

	updateButtons: function() {
		foreach(this.skills, function(skill) {
			skill.updateButton();
		});
	},

	getSkill: function(skillName) {
		return this.skills[skillName];
	},

	getPassiveMult: function(stat) {
		var mult = 1;
		foreach (this.skills, function(skill) {
			if (skill.category === 'Passive') {
				mult *= skill.getMult(stat);
			}
		});
		return mult;
	},

	getPassiveBase: function(stat) {
		var base = 0;
		foreach (this.skills, function(skill) {
			if (skill.category === 'Passive') {
				base += skill.getBase(stat);
			}
		});
		return base;
	},

	equip: function(skillName) {
		var skill = this.getSkill(skillName);
		if (skill.level > 0 && skill.isAttack()) {
			Player.attackName = skillName;
		}
	},

	tryPurchase: function(skillName) {
		var skill = this.getSkill(skillName);
		if (skill.canPurchase()) {
			Player.spend(skill.getCurrency(), skill.getCost(), function() {
				skill.purchase();
			});
		}
	},

	keyPressed: function(key) {
		foreach (this.skills, function(skill) {
			if (skill.keyCode === key) {
				Skills.equip(skill.name);
				return;
			}
		});
	},
};

function SkillDef(data) {
	this.toSave = ['researched', 'level'];

	this.name = data.name || '';
	this.category = data.category || '';

	this.displayName = data.displayName || '';
	this.description = data.description || '';

	this.researchCost = data.researchCost || 0;
	this.baseCost = data.baseCost || 1000;
	this.upgradeCost = (data.upgradeCostMult || 1) * 35;
	this.prereqs = data.prereqs || null;

	this.level = data.level || 0;
	this.researched = this.level > 0 || this.researchCost <= 0;

	this.getCost = function() {
		if (!this.researched) {
			return this.researchCost;
		}

		return Math.floor(this.baseCost + this.upgradeCost * Math.pow(this.level, 2));
	};

	this.getCurrency = function() {
		if (!this.researched) {
			return 'research';
		}
		return 'skill';
	};

	this.canPurchase = function() {
		return Player.canSpend(this.getCurrency(), this.getCost());
	};

	this.purchase = function() {
		if (!this.researched) {
			this.researched = true;
		}
		else {
			this.level += 1;
		}
	};

	this.isAttack = function() {
		return this.category === 'Attack' || this.category === 'Spell';
	};

	this.getButtonHtml = function() {
		return '<div class="skill-container" id="' + this.name + '"><span id="name"></span>' +
			getButtonHtml("Skills.tryPurchase('" + this.name + "')",
				'<span id="action"></span><span id="level"></span>' +
				'<br><span id="cost"></span>', 'button', 'skill') +
			'<div id="description"></div>' +
			'</div>';
	};

	this.getAttackButtonHtml = function() {
		var keyStr = this.keyCode ? ' (' + this.keyCode.toUpperCase() + ')' : '';
		return getButtonHtml("Skills.equip('" + this.name + "')",
				this.displayName + keyStr + '<br><span id="mana"></span>',
				this.name + '-equip');
	};

	this.updateButton = function() {
		var id = '.skill-container#' + this.name;
		var equipId = '#' + this.name + '-equip';
		var isKnown = this.level > 0;
		var isVisible = this.isKnown || prereqsMet(this.prereqs);
		j(id, 'toggle', isVisible);
		j(equipId, 'toggle', isKnown);

		if (isKnown) {
			var isEquipped = this.name === Player.attackName;
			j(equipId, 'toggleClass', 'selected', isEquipped);
			var manaText = '';
			if (this.manaCost && this.getManaCost() > 0) {
				manaText = formatNumber(this.getManaCost()) + ' MP';
			}
			j(equipId + ' #mana', 'text', manaText);
		}
		if (isVisible) {
			j(id + ' #button', 'toggleClass', 'inactive', !this.canPurchase());

			j(id + ' #name', 'text', this.displayName);
			var actionText = 'Level';
			if (!this.researched) {
				actionText = 'Research';
			}
			else if (this.level === 0) {
				actionText = 'Learn';
			}
			j(id + ' #action', 'text', actionText);

			var levelText = '';
			if (this.level > 0) {
				levelText = ' (L' + formatNumber(this.level) + ')';
			}
			j(id + ' #level', 'text', levelText);

			j(id + ' #cost', 'html', formatNumber(this.getCost()) +
				' ' + getIconHtml(this.getCurrency()));

			j(id + ' #description', 'toggle', this.researched);
			j(id + ' #description', 'html', this.getDescription());
		}
	};

	this.getDescriptionAtLevel = function(level) {
		return this.displayName + ' Level ' + level;
	};

	this.getLevelDescription = function() {
		if (this.level < 1) {
			return this.getDescriptionAtLevel(1);
		}
		return this.getDescriptionAtLevel(this.level) + ' --> ' + this.getDescriptionAtLevel(this.level + 1);
	};

	this.getDescription = this.getLevelDescription;
}

function AttackSkillDef(data) {
	this.__proto__ = new SkillDef(data);
	this.category = 'Attack';

	this.keyCode = data.keyCode || null;

	this.manaCost = data.manaCost || 0;

	this.baseDamage = data.baseDamage || 100;
	this.levelDamage = data.levelDamage || 10;

	this.baseCrit = data.baseCrit || 0;
	this.bonuses = data.bonuses || {};

	this.getDamage = function() {
		return this.getDamageAtLevel(this.level);
	};

	this.getDamageAtLevel = function(level) {
		return this.baseDamage + this.levelDamage * (level - 1);
	};

	this.getBonusMult = function(bonus) {
		if (!this.bonuses[bonus]) {
			return 1;
		}
		return 1 + this.bonuses[bonus] / 100;
	};

	this.getManaCost = function() {
		return this.getManaCostAtLevel(this.level);
	};

	this.getManaCostAtLevel = function(level) {
		if (this.manaCost) {
			return Math.floor(this.manaCost * (1 + (level - 1) * 0.1));
		}
		return 0;
	};

	this.getBaseCrit = function() {
		return this.baseCrit;
	};

	this.getDescriptionAtLevel = function(level) {
		var baseStr = '<div id="base"><ul><li>Damage: ' + formatNumber(this.getDamageAtLevel(level)) + '</li>';
		if (this.getBaseCrit()) {
			baseStr += '<li>Crit Chance: ' + formatNumber(this.getBaseCrit()) + '%</li>';
		}
		if (this.getManaCostAtLevel(level)) {
			baseStr += '<li>Mana Cost:' + formatNumber(this.getManaCostAtLevel(level)) + '</li>';
		}
		baseStr += '</ul></div>';
		return baseStr;
	};

	this.getDescription = function() {
		return '<div>' + this.description + '</div><div>' + this.getLevelDescription() + '</div>';
	};

	this.doAttack = data.doAttack || function(enemy) {
		enemy.takeDamage(Player.getDamageInfo());
	};
}

function SpellSkillDef(data) {
	data.prereqs = merge(data.prereqs, {
		buildings: {
			'wizard-tower': 1
		}
	});
	this.__proto__ = new AttackSkillDef(data);
	this.category = 'Spell';
}

function PassiveSkillDef(data) {
	this.__proto__ = new SkillDef(data);
	this.category = 'Passive';

	var stats = {};
	stats.mult = data.statMult || {};
	stats.base = data.statBase || {};

	var getAmount = function(type, stat, level) {
		var s = stats[type][stat];
		if (!s || level < 1) {
			return 0;
		}
		var base = s.base || 0;
		var levAmt = s.level || 0;
		return base + levAmt * (level - 1);
	};

	this.getMult = function(stat, base) {
		return 1 + getAmount('mult', stat, this.level) / 100;
	};

	this.getBase = function(stat, base) {
		return getAmount('base', stat, this.level);
	};

	this.getDescriptionAtLevel = function(level) {
		var str = this.description;
		var statFields = ['mult', 'base'];
		for (var i = 0; i < statFields.length; i++) {
			var field = statFields[i];
			for (var stat in stats[field]) {
				var matchStr = '<' + field + '.' + stat + '>';
				while (str.indexOf(matchStr) != -1) {
					var replaceStr = formatNumber(getAmount(field, stat, level));
					str = str.replace(matchStr, replaceStr);
				}
			}
		}
		return str;
	};
}
