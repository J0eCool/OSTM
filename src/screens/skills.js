Skills = {
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
		var html = '';
		foreach(this.skills, function(skill) {
			html += skill.getButtonHtml();
		});
		j('.skills').html(html);

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

	equip: function(skillName) {
		var skill = this.getSkill(skillName);
		if (skill.level > 0 && skill.category === 'Attack') {
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
	}
};

function SkillDef(data) {
	this.toSave = ['researched', 'level'];

	this.name = data.name || '';
	this.category = data.category || '';

	this.displayName = data.displayName || '';

	this.researchCost = data.researchCost || 0;
	this.baseCost = data.baseCost || 1000;
	this.upgradeCost = (data.upgradeCostMult || 1) * 150;
	this.ascendCost = (data.ascendCostMult || 1) * 500;
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
		return !AdventureScreen.isAdventuring() &&
			Player.canSpend(this.getCurrency(), this.getCost());
	};

	this.purchase = function() {
		if (!this.researched) {
			this.researched = true;
		}
		else {
			this.level += 1;
		}
	};

	this.getButtonHtml = function() {
		return '<div class="skill-container" id="' + this.name + '">' +
			getButtonHtml("Skills.equip('" + this.name + "')", "Equip " +
				this.displayName + ' <span id="level"></span>', 'equip') +
			' ' + getButtonHtml("Skills.tryPurchase('" + this.name + "')",
				'<span id="action"></span>' +
				'<br><span id="cost"></span>', 'button') +
			'<span id="description"></span>' +
			'</div>';
	};

	this.updateButton = function() {
		var id = '.skill-container#' + this.name;
		var isVisible = this.level > 0 || prereqsMet(this.prereqs);
		j(id, 'toggle', isVisible);

		if (isVisible) {
			var isEquipped = this.name === Player.attackName;
			j(id + ' #equip', 'toggle', this.level > 0);
			j(id + ' #equip', 'toggleClass', 'selected', isEquipped);

			j(id + ' #button', 'toggleClass', 'inactive', !this.canPurchase());

			var actionText = 'Level ';
			if (!this.researched) {
				actionText = 'Research ';
			}
			else if (this.level === 0) {
				actionText = 'Learn ';
			}
			actionText += this.displayName;
			j(id + ' #action', 'text', actionText);

			var levelText = '';
			if (this.level > 0) {
				levelText += '(L' + this.level + ')';
			}
			j(id + ' #level', 'text', levelText);

			j(id + ' #cost', 'html', formatNumber(this.getCost()) +
				' ' + getIconHtml(this.getCurrency()));

			j(id + ' #description', 'toggle', this.researched);
			var descriptionText = 'Damage: ' + this.getDamage();
			j(id + ' #description', 'text', descriptionText);
		}
	};
}

function AttackDef(data) {
	this.__proto__ = new SkillDef(data);
	this.category = 'Attack';

	this.manaCost = data.manaCost || 0;
	
	this.baseDamage = data.baseDamage || 100;
	this.levelDamage = data.levelDamage || 10;

	this.getDamage = function() {
		return this.baseDamage + this.levelDamage * this.level;
	};
}