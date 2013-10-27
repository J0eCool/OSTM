Forge = {
	toSave: ['fillOnClick', 'fillPerSecond'],

	recipes: [],

	fillOnClick: 1,
	fillPerSecond: 0,
	partialFill: 0,

	init: function() {
		this.recipes = loadRecipes();

		$('.forge-container').click(function() {
			Forge.addFill(Forge.fillOnClick);
			Forge.createFillParticle('+' + formatNumber(Forge.fillOnClick));
		});

		Inventory.updateButtons();
		this.setupButtons();
		this.updateButtons();
	},

	update: function() {
		var dT = Game.normalDt / 1000;
		this.partialFill += this.fillPerSecond * dT;
		var filled = Math.floor(this.partialFill);
		if (filled > 0) {
			this.addFill(filled);
			this.partialFill -= filled;
		}

		this.updateButtons();
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

	setupButtons: function() {
		var htmlStr = '';
		for (var i = 0; i < this.recipes.length; i++) {
			htmlStr += this.recipes[i].getButtonHtml() + '<br/>';
		}

		$('.recipes').html(htmlStr);
	},

	updateButtons: function() {
		for (var i = 0; i < this.recipes.length; i++) {
			this.recipes[i].updateButton();
		}
	}
};

function Recipe(data) {
	this.name = data.name || '';
	this.displayName = data.displayName || data.name || '';
	this.itemDef = data.itemDef || Inventory.getItem(this.name) || null;
	this.baseCost = data.baseCost || 100;
	this.currency = data.currency || 'forge';

	this.getButtonHtml = function() {
		return getButtonHtml("Forge.selectRecipe('" + this.name + "')",
			this.displayName + '<br /><span id="cost"></span> ' + getIconHtml(this.currency),
			this.name + '-button'
		);
	};

	this.updateButton = function() {
		var id = '#' + this.name + '-button';
		$(id).toggleClass('inactive', !this.canMakeMore());
		$(id + ' span #cost').text(formatNumber(this.getCost()));
	};

	this.tryPurchase = function() {
		var cost = this.getCost();
		if (cost <= Player[this.currency]) {
			if (this.isLimitReached()) {
				Forge.createFillParticle('MAXED');
			}
			else {
				Player[this.currency] -= cost;
				this.onComplete();

				Inventory.updateButtons();
				Forge.updateButtons();
			}
		}
	};

	this.onComplete = function() {
		if (this.itemDef) {
			this.itemDef.count += 1;
		}

		if (this.onComplete_internal) {
			this.onComplete_internal();
		}

		if (this.isLimitReached()) {
			this.itemDef.count = this.itemDef.maxItemCount();

			Forge.createFillParticle('MAXED');
		}
	};
	this.onComplete_internal = data.onComplete || null;

	this.getCost = data.getCost || function() {
		return this.baseCost;
	};

	this.canAfford = function() {
		return this.getCost() <= Player[this.currency];
	};

	this.isLimitReached = data.isLimitReached || function() {
		return this.itemDef.isItemMaxed();
	};

	this.canMakeMore = function() {
		return AdventureScreen.isOpen('store') && this.canAfford() && !this.isLimitReached();
	};
}
