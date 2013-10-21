Forge = {

	recipes: [
		new Recipe({
			name: 'potion',
			fill: 20,
			baseMaxFill: 25
		}),
		new Recipe({
			name: 'hiPotion',
			baseMaxFill: 100
		}),

		new Recipe({
			name: 'weapon+',
			displayName: 'Upgrade Weapon',
			baseMaxFill: 100,
			getMaxFill: function() {
				return this.baseMaxFill * (1 + 4 * Math.pow(this.itemDef.count, 2));
			},
			onComplete: function() {
				Player.weaponDamage += 1;
			}
		}),
		new Recipe({
			name: 'armor+',
			displayName: 'Upgrade Armor',
			baseMaxFill: 50,
			getMaxFill: function() {
				return this.baseMaxFill * (1 + Math.floor(Math.pow(this.itemDef.count, 1.8)));
			},
			onComplete: function() {
				Player.armor += 1;
			}
		}),
		new Recipe({
			name: 'inventory+',
			displayName: 'Raise Item Capacity',
			baseMaxFill: 50,
			getMaxFill: function() {
				return this.baseMaxFill * (1 + Math.pow(this.itemDef.count, 2));
			},
			onComplete: function() {
				Inventory.slotsPerItem += 1;
			}
		}),
		new Recipe({
			name: 'forge-click',
			displayName: 'Increase ' + getIconHtml('forge') + ' per Click',
			baseMaxFill: 150,
			getMaxFill: function() {
				return this.baseMaxFill * (1 + Math.pow(this.itemDef.count, 2));
			},
			onComplete: function() {
				Forge.fillOnClick += this.itemDef.count;
			}
		}),
		new Recipe({
			name: 'forge-second',
			displayName: 'Increase ' + getIconHtml('forge') + ' per Second',
			baseMaxFill: 25,
			getMaxFill: function() {
				return this.baseMaxFill * (1 + 2 * Math.pow(this.itemDef.count, 2));
			},
			onComplete: function() {
				Forge.fillPerSecond += 1;
			}
		})
	],

	curRecipe: null,
	fillOnClick: 1,
	fillPerSecond: 0,
	partialFill: 0,

	init: function() {
		this.curRecipe = this.recipes[this.recipes.length - 1];

		$('.forge-container').click(function() {
			Forge.addFill(Forge.fillOnClick);
			Forge.createFillParticle('+' + formatNumber(Forge.fillOnClick));
		});

		$('#gold-convert').html(formatNumber(1000) + getIconHtml('gold') + ' -> ' + '[amount]' + getIconHtml('forge'))
			.click(function() {
				if (Player.gold >= 1000) {
					Player.gold -= 1000;
					var amount = 75 * Forge.fillOnClick;
					Forge.addFill(amount);
					Forge.createFillParticle('+' + formatNumber(amount));
				}
			});

		this.updateFill();
		Inventory.updateButtons();
		this.updateRecipes();
	},

	update: function() {
		var dT = Game.normalDt / 1000;
		if (this.curRecipe.canMakeMore()) {
			this.partialFill += this.fillPerSecond * dT;
			var filled = Math.floor(this.partialFill);
			if (filled > 0) {
				this.addFill(filled);
				this.partialFill -= filled;
			}
		}
	},

	updateFill: function() {
		var pct = this.curRecipe.fill / this.curRecipe.getMaxFill();
		$('.forge-fill').css({
			'height': 110 * pct + 'px',
			'top': 55 + 110 * (1 - pct) + 'px'
		});
	},

	addFill: function(amount) {
		var recipe = this.curRecipe;

		recipe.fill += amount;
		if (!recipe.canMakeMore()) {
			recipe.fill = 0;
			this.createFillParticle('MAXED');
		}
		else {
			if (recipe.fill >= recipe.getMaxFill()) {
				recipe.onComplete();
				Inventory.updateButtons();
				this.updateRecipes();
			}
		}
		this.updateFill();
	},

	selectRecipe: function(recipeName) {
		for (var i = 0; i < this.recipes.length; i++) {
			var recipe = this.recipes[i];
			if (recipe.name == recipeName) {
				this.curRecipe = recipe;
				this.updateFill();
				this.updateRecipes();
				return;
			}
		}
	},

	createFillParticle: function(message) {
		var container = $('.forge-container');
		var pos = container.position();
		var x = pos.left + rand(0.2, 0.8) * container.width();
		var y = pos.top + rand(0.2, 0.8) * container.height();
		ParticleContainer.create(forgeParticleType, message, x, y);
	},

	updateRecipes: function() {
		var htmlStr = '';
		for (var i = 0; i < this.recipes.length; i++) {
			htmlStr += this.recipes[i].getButtonHtml() + '<br />';
		}

		$('.recipes').html(htmlStr);
	}
};

function Recipe(data) {
	this.name = data.name || '';
	this.displayName = data.displayName || data.name || '';
	this.fill = data.fill || 0;
	this.baseMaxFill = data.baseMaxFill || 100;
	this.itemDef = data.itemDef || Inventory.getItem(this.name) || null;

	this.getButtonHtml = function() {
		var selected = Forge.curRecipe == this;
		return '<button onclick="Forge.selectRecipe(\'' + this.name + '\')">'
			+ (selected ? '<b>*' : '')
			+ this.displayName
			+ (selected ? '*</b>' : '')
			+ '<br />' + formatNumber(this.getMaxFill()) + ' ' + getIconHtml('forge')
			+ '</button>';
	};

	this.onComplete = function() {
		var amt = Math.floor(this.fill / this.getMaxFill());
		this.fill -= this.getMaxFill() * amt;

		if (this.itemDef) {
			this.itemDef.count += amt;
		}

		if (this.onComplete_internal) {
			this.onComplete_internal();
		}

		if (!this.canMakeMore()) {
			this.itemDef.count = this.itemDef.maxItemCount();
			this.fill = 0;

			Forge.createFillParticle('MAXED');
		}
	};
	this.onComplete_internal = data.onComplete || null;

	this.getMaxFill = data.getMaxFill || function() {
		return this.baseMaxFill;
	};

	this.canMakeMore = data.canMakeMore || function() {
		return !this.itemDef.isItemMaxed();
	};
};
