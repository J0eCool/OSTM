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

		// Reset old consumable items data
		if (Save.isSaveOlderThan('0.2.9')) {
			var baseItems = loadItems();
			for (key in baseItems) {
				// only reset consumables!
				if (baseItems[key].curCount !== undefined) {
					this.items[key].count = baseItems[key].count;
				}
			}
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
		if (item && item.canUse()) {
			if (item.isConsumed) {
				item.count -= 1;
			}
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
	this.isCountLimited = (data.isCountLimited !== undefined ? data.isCountLimited : false);
	this.maxPerInvSlot = data.maxPerInvSlot || 1;

	this.storeName = data.storeName || data.displayName || data.name || '';
	this.baseCost = data.baseCost || 100;
	this.currency = data.currency || 'gold';
	this.researchCost = data.researchCost || 0;
	this.prereqs = data.prereqs || null;

	this.count = data.count || 0;
	this.isResearched = (this.researchCost <= 0) || false;

	this.isConsumed = true;

	this.getButtonHtml = function() {
		return getButtonHtml("Inventory.useItem('" + this.name + "')",
			'<b>' + this.displayName + '</b>: <span id="count"></span>' +
			(this.curCount !== undefined ? ' / <span id="max-count"></span>' : ''),
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
		var isVisible = this.isVisible();
		j(id, 'toggle', isVisible);
		if (isVisible) {
			j(id + ' #count', 'text', formatNumber(this.getCount()));
			j(id + ' #max-count', 'text', formatNumber(this.maxItemCount()));
		}

		var storeId = '.store-item#' + this.name + ' #button';
		var storeVisible = this.isVisibleInStore();
		j('.store-item#' + this.name, 'toggle', storeVisible);
		if (storeVisible) {
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
		}
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
			if (this.curCount !== undefined) {
				this.curCount += 1;
			}
		}

		this.update();
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

	this.canUse = function() {
		return this.count > 0 && this.onUse;
	};

	this.getCount = function() {
		return this.count;
	};
}

function PotionDef(data) {
	this.__proto__ = new ItemDef(data);
	this.toSave.push('curCount');
	this.isConsumed = false;

	this.healAmount = data.healAmount || 0;
	this.manaAmount = data.manaAmount || 0;
	this.curCount = data.curCount || 0;

	this.onUse = function() {
		var mult = Skills.getPassiveMult('itemEffeciency');
		var heal = Math.floor(mult * this.healAmount);
		var mana = Math.floor(mult * this.manaAmount);
		Player.addHealth(heal);
		Player.addMana(mana);

		this.curCount--;
	};

	this.getCost = function() {
		if (!this.isResearched) {
			return this.researchCost;
		}
		return this.baseCost * Math.pow(3, this.count);
	};

	this.description = 'Restores';
	if (this.healAmount) {
		this.description += ' ' + formatNumber(this.healAmount) + 'HP';
	}
	if (this.manaAmount) {
		this.description += ' ' + formatNumber(this.manaAmount) + 'MP';
	}

	this.canUse = function() {
		return this.curCount > 0;
	};

	this.getCount = function() {
		return this.curCount;
	};

	this.maxItemCount = function() {
		return this.count;
	};
}

