Inventory = {
	slotsPerItem: 5,

	items: [],

	init: function() {
		this.items = loadItems();
	},

	updateButtons: function() {
		var htmlStr = '';
		for (var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			if (item.count > 0 && item.onUse) {
				htmlStr += item.getButtonHtml();
			}
		}
		$('.inventory').html(htmlStr);
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
	this.name = data.name || '';
	this.displayName = data.displayName || data.name || '';
	this.data = data.data || null;
	this.onUse = data.onUse || null;
	this.count = data.count || 0;
	this.isCountLimited = (data.isCountLimited !== undefined ? data.isCountLimited : true);
	this.maxPerInvSlot = data.maxPerInvSlot || 1;

	this.getButtonHtml = function() {
		return getButtonHtml("Inventory.useItem('" + this.name + "')",
			this.displayName + ': ' + formatNumber(this.count) +
			(this.isCountLimited ? ' / ' + formatNumber(this.maxItemCount()) : '')
		);
	};

	this.maxItemCount = function() {
		return this.maxPerInvSlot * Inventory.slotsPerItem;
	};

	this.isItemMaxed = function() {
		return this.isCountLimited && this.count >= this.maxItemCount();
	};
}

function PotionDef(data) {
	this.__proto__ = new ItemDef(data);
	this.onUse = function() {
		Player.addHealth(Math.floor(this.data.healAmount * Player.itemEfficiency.value()));
	};
}

