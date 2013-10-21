Forge = {

	recipes: [
		new Recipe({
			name: 'potion',
			fill: 25,
			maxFill: 35
		}),
		new Recipe({
			name: 'hiPotion',
			maxFill: 100
		}),
		new Recipe({
			name: 'rock',
			displayName: 'Wondrous Rock',
			maxFill: 4
		})
	],

	curRecipe: null,
	fillOnClick: 1,

	init: function() {
		this.curRecipe = this.recipes[0];

		$('.forge-container').click(function() {
			Forge.addFill(Forge.fillOnClick);
		});
		this.updateFill();
		Inventory.updateButtons();
		this.updateRecipes();
	},

	updateFill: function() {
		var pct = this.curRecipe.fill / this.curRecipe.maxFill;
		$('.forge-fill').css({
			'height': 110 * pct + 'px',
			'top': 55 + 110 * (1 - pct) + 'px'
		});
	},

	addFill: function(amount) {
		var recipe = this.curRecipe;

		recipe.fill += amount;
		if (Inventory.isItemMaxed(recipe.itemDef)) {
			recipe.fill = 0;
			this.createFillParticle('MAXED');
		}
		else {
			this.createFillParticle('+' + formatNumber(amount));
			if (recipe.fill >= recipe.maxFill) {
				var amt = Math.floor(recipe.fill / recipe.maxFill);
				recipe.fill -= recipe.maxFill * amt;
				recipe.itemDef.count += amt;

				if (Inventory.isItemMaxed(recipe.itemDef)) {
					recipe.itemDef.count = Inventory.maxItemCount;
					recipe.fill = 0;

					this.createFillParticle('MAXED');
				}

				Inventory.updateButtons();
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
	this.maxFill = data.maxFill || 100;
	this.itemDef = data.itemDef || Inventory.getItem(this.name) || null;

	this.getButtonHtml = function() {
		var selected = Forge.curRecipe == this;
		return '<button onclick="Forge.selectRecipe(\'' + this.name + '\')">'
			+ (selected ? '<b>*' : '')
			+ this.displayName
			+ (selected ? '*</b>' : '')
			+ '</button>';
	};
};
