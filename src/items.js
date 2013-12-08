var Inventory = {
	toSave: ['items'],

	items: {},
	
	slotsPerItem: 3,

	init: function() {
		this.items = loadItems();
		this.setupButtons();
	},

	postLoad: function() {
		for (var key in this.items) {
			this.items[key].update();
		}
	},

	update: function() {
		this.updateButtons();
	},

	setupButtons: function() {
		var htmlStr = '';
		var storeHtmlStr = '';
		for (var key in this.items) {
			var item = this.items[key];
			htmlStr += item.getButtonHtml();
			storeHtmlStr += item.getStoreButtonHtml();
		}
		j('.inventory').html(htmlStr);
		j('.recipes').html(storeHtmlStr);
	},

	updateButtons: function() {
		for (var key in this.items) {
			var item = this.items[key];
			item.updateButtons();
		}
	},

	getItem: function(itemName) {
		return this.items[itemName];
	},

	useItem: function(itemName) {
		var item = this.getItem(itemName);
		if (item && item.count > 0 && item.onUse) {
			item.count -= 1;
			item.onUse();
			this.updateButtons();
		}
	},

	tryPurchase: function(itemName) {
		this.getItem(itemName).tryPurchase();
	}
};

function ItemDef(data) {
	this.toSave = ['count', 'isResearched'];

	this.name = data.name || '';
	this.displayName = data.displayName || data.name || '';
	this.description = data.description || '';

	this.onUse = data.onUse || null;
	this.isCountLimited = (data.isCountLimited !== undefined ? data.isCountLimited : true);
	this.maxPerInvSlot = data.maxPerInvSlot || 1;

	this.storeName = data.storeName || data.displayName || data.name || '';
	this.baseCost = data.baseCost || 100;
	this.currency = data.currency || 'gold';
	this.researchCost = data.researchCost || 0;
	this.prereqs = data.prereqs || null;

	this.count = data.count || 0;
	this.isResearched = (this.researchCost <= 0) || false;

	this.getButtonHtml = function() {
		return getButtonHtml("Inventory.useItem('" + this.name + "')",
			'<b>' + this.displayName + '</b>: <span id="count"></span>' +
			(this.isCountLimited ? ' / <span id="max-count"></span>' : ''),
			this.name + '-inv-button'
		);
	};

	this.getStoreButtonHtml = function() {
		return '<div class="store-item" id="' + this.name + '">' +
			getButtonHtml("Inventory.tryPurchase('" + this.name + "')",
				'<b id="name"></b><br><span id="cost"></span> <span id="currency"></span>',
				'button') +
			' <span class="description"></span></div>';
	};

	this.updateButtons = function() {
		var id = '#' + this.name + '-inv-button';
		j(id, 'toggle', this.isVisible());
		j(id + ' #count', 'text', formatNumber(this.count));
		j(id + ' #max-count', 'text', formatNumber(this.maxItemCount()));

		var storeId = '.store-item#' + this.name + ' #button';
		j('.store-item#' + this.name, 'toggle', this.isVisibleInStore());

		var buttonClass = 'button ' + this.getCurrency();
		if (!this.canMakeMore()) {
			buttonClass += ' inactive';
		}
		j(storeId, 'attr', 'class', buttonClass);
		
		j(storeId + ' #name', 'html', this.isResearched ? this.storeName : 'Research ' + this.storeName);
		j(storeId + ' span #cost', 'text', formatNumber(this.getCost()));
		j(storeId + ' span #currency', 'html', getIconHtml(this.getCurrency()));
		j('.store-item#' + this.name + ' .description', 'html',
			this.isResearched ? this.description : '');
	};

	this.maxItemCount = function() {
		return this.maxPerInvSlot * Inventory.slotsPerItem;
	};

	this.isItemMaxed = function() {
		return this.isCountLimited && this.count >= this.maxItemCount();
	};

	this.isVisible = function() {
		return this.onUse !== null && (this.count > 0);
	};

	this.isVisibleInStore = function() {
		return prereqsMet(this.prereqs) && (this.isResearched || canResearch());
	};

	this.update = data.update || function() {};

	this.tryPurchase = function() {
		if (this.canMakeMore()) {
			var that = this;
			Player.spend(this.getCurrency(), this.getCost(), function() {
				that.onPurchase();

				Inventory.updateButtons();
			});
		}
	};

	this.onPurchase = function() {
		if (!this.isResearched) {
			this.isResearched = true;
		}
		else {
			this.count += 1;
		}

		this.update();

		if (this.isLimitReached()) {
			this.count = this.maxItemCount();
		}
	};

	this.getCost = function(that, costFunc) {
		var cost = costFunc && costFunc.bind(that);
		return function() {
			if (!this.isResearched) {
				return this.researchCost;
			}
			if (cost) {
				return cost();
			}
			return this.baseCost;
		};
	}(this, data.getCost);

	this.getCurrency = function() {
		if (!this.isResearched) {
			return 'research';
		}
		return this.currency;
	};

	this.canAfford = function() {
		return this.getCost() <= Player[this.getCurrency()].amount;
	};

	this.isLimitReached = data.isLimitReached || function() {
		return this.isItemMaxed();
	};

	this.canMakeMore = function() {
		return !AdventureScreen.isAdventuring() && this.canAfford() && !this.isLimitReached();
	};
}

function PotionDef(data) {
	this.__proto__ = new ItemDef(data);

	this.healAmount = data.healAmount || 0;
	this.manaAmount = data.manaAmount || 0;

	this.onUse = function() {
		var mult = Skills.getPassiveMult('itemEffeciency');
		var heal = Math.floor(mult * this.healAmount);
		var mana = Math.floor(mult * this.manaAmount);
		Player.addHealth(heal);
		Player.addMana(mana);
	};

	this.description = 'Restores';
	if (this.healAmount) {
		this.description += ' ' + formatNumber(this.healAmount) + 'HP';
	}
	if (this.manaAmount) {
		this.description += ' ' + formatNumber(this.manaAmount) + 'MP';
	}
}

