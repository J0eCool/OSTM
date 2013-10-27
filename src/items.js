Inventory = {
	toSave: ['items'],

	slotsPerItem: 5,

	items: [],

	init: function() {
		this.items = loadItems();
		this.setupButtons();
	},

	update: function() {
		this.updateButtons();
	},

	setupButtons: function() {
		var htmlStr = '';
		for (var i = 0; i < this.items.length; i++) {
			htmlStr += this.items[i].getButtonHtml();
		}
		$('.inventory').html(htmlStr);
	},

	updateButtons: function() {
		for (var i = 0; i < this.items.length; i++) {
			this.items[i].updateButton();
		}
	},

	getItem: function(itemName) {
		for (var i = 0; i < this.items.length; i++) {
			if (this.items[i].name == itemName) {
				return this.items[i];
			}
		}
		return null;
	},

	useItem: function(itemName) {
		var item = this.getItem(itemName);
		if (item && item.count > 0 && item.onUse) {
			item.count -= 1;
			item.onUse();
			this.updateButtons();
		}
	}
};

function ItemDef(data) {
	this.toSave = ['name', 'count'];

	this.name = data.name || '';
	this.displayName = data.displayName || data.name || '';
	this.data = data.data || null;
	this.onUse = data.onUse || null;
	this.count = data.count || 0;
	this.isCountLimited = (data.isCountLimited !== undefined ? data.isCountLimited : true);
	this.maxPerInvSlot = data.maxPerInvSlot || 1;

	this.getButtonHtml = function() {
		return getButtonHtml("Inventory.useItem('" + this.name + "')",
			this.displayName + ': <span id="count"></span>' +
			(this.isCountLimited ? ' / <span id="max-count"></span>' : ''),
			this.name + '-inv-button'
		);
	};

	this.updateButton = function() {
		var id = '#' + this.name + '-inv-button';
		$(id).toggle(this.isVisible());
		$(id + ' #count').text(formatNumber(this.count));
		$(id + ' #max-count').text(formatNumber(this.maxItemCount()));
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
}

function PotionDef(data) {
	this.__proto__ = new ItemDef(data);
	this.onUse = function() {
		Player.addHealth(Math.floor(this.data.healAmount * Player.itemEfficiency.value()));
	};
}

