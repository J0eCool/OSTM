Forge = {

	recipes: [
		new Recipe({
			name: 'potion',
			baseCost: 25
		}),
		new Recipe({
			name: 'gold-potion',
			baseCost: 25,
			currency: 'gold',
			itemDef: Inventory.getItem('potion')
		}),
		new Recipe({
			name: 'hiPotion',
			baseCost: 100
		}),

		new Recipe({
			name: 'weapon+',
			displayName: 'Upgrade Weapon',
			baseCost: 100,
			getCost: function() {
				return this.baseCost * (1 + 4 * Math.pow(this.itemDef.count, 2));
			},
			onComplete: function() {
				Player.weaponDamage += 1;
			}
		}),
		new Recipe({
			name: 'armor+',
			displayName: 'Upgrade Armor',
			baseCost: 50,
			getCost: function() {
				return this.baseCost * (1 + Math.floor(Math.pow(this.itemDef.count, 1.8)));
			},
			onComplete: function() {
				Player.armor += 1;
			}
		}),
		new Recipe({
			name: 'inventory+',
			displayName: 'Raise Item Capacity',
			baseCost: 50,
			getCost: function() {
				return this.baseCost * (1 + Math.pow(this.itemDef.count, 2));
			},
			onComplete: function() {
				Inventory.slotsPerItem += 1;
			}
		}),
		new Recipe({
			name: 'forge-click',
			displayName: 'Increase ' + getIconHtml('forge') + ' per Click',
			baseCost: 150,
			currency: 'gold',
			getCost: function() {
				return this.baseCost * (1 + Math.pow(this.itemDef.count, 2));
			},
			onComplete: function() {
				Forge.fillOnClick += this.itemDef.count;
			}
		}),
		new Recipe({
			name: 'forge-second',
			displayName: 'Increase ' + getIconHtml('forge') + ' per Second',
			baseCost: 25,
			currency: 'gold',
			getCost: function() {
				return this.baseCost * (1 + 2 * Math.pow(this.itemDef.count, 2));
			},
			onComplete: function() {
				Forge.fillPerSecond += 1;
			}
		})
	],

	fillOnClick: 1,
	fillPerSecond: 0,
	partialFill: 0,

	init: function() {
		$('.forge-container').click(function() {
			Forge.addFill(Forge.fillOnClick);
			Forge.createFillParticle('+' + formatNumber(Forge.fillOnClick));
		});

		$('#gold-convert').html('<span>' + formatNumber(1000) + getIconHtml('gold') + ' -> ' + '[amount]' + getIconHtml('forge') + '</span>')
			.click(function() {
				if (Player.gold >= 1000) {
					Player.gold -= 1000;
					var amount = 75 * Forge.fillOnClick;
					Forge.addFill(amount);
					Forge.createFillParticle('+' + formatNumber(amount));
				}
			});

		Inventory.updateButtons();
		this.updateRecipes();
	},

	update: function() {
		var dT = Game.normalDt / 1000;
		//if (this.curRecipe.canMakeMore()) {
			this.partialFill += this.fillPerSecond * dT;
			var filled = Math.floor(this.partialFill);
			if (filled > 0) {
				this.addFill(filled);
				this.partialFill -= filled;
			}
		//}
	},

	addFill: function(amount) {
		Player.forge += amount;
	},

	selectRecipe: function(recipeName) {
		for (var i = 0; i < this.recipes.length; i++) {
			var recipe = this.recipes[i];
			if (recipe.name == recipeName) {
				recipe.tryPurchase();
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
			htmlStr += this.recipes[i].getButtonHtml();
		}

		$('.recipes').html(htmlStr);
	}
};

function Recipe(data) {
	this.name = data.name || '';
	this.displayName = data.displayName || data.name || '';
	this.itemDef = data.itemDef || Inventory.getItem(this.name) || null;
	this.baseCost = data.baseCost || 100;
	this.currency = data.currency || 'forge';

	this.getButtonHtml = function() {
		var selected = Forge.curRecipe == this;
		return getButtonHtml("Forge.selectRecipe('" + this.name + "')",
			(selected ? '<b>*' : '')
			+ this.displayName
			+ (selected ? '*</b>' : '')
			+ '<br />' + formatNumber(this.getCost()) + ' ' + getIconHtml(this.currency)
		);
	};


	this.tryPurchase = function() {
		var cost = this.getCost();
		if (cost <= Player[this.currency]) {
			if (!this.canMakeMore()) {
				Forge.createFillParticle('MAXED');
			}
			else {
				Player[this.currency] -= cost;
				this.onComplete();

				Inventory.updateButtons();
				Forge.updateRecipes();
			}
		}
	}

	this.onComplete = function() {
		if (this.itemDef) {
			this.itemDef.count += 1;
		}

		if (this.onComplete_internal) {
			this.onComplete_internal();
		}

		if (!this.canMakeMore()) {
			this.itemDef.count = this.itemDef.maxItemCount();

			Forge.createFillParticle('MAXED');
		}
	};
	this.onComplete_internal = data.onComplete || null;

	this.getCost = data.getCost || function() {
		return this.baseCost;
	};

	this.canMakeMore = data.canMakeMore || function() {
		return !this.itemDef.isItemMaxed();
	};
};
