Inventory = {
	maxItemCount: 5,

	items: [
		new PotionDef({
			name: 'potion',
			data: {
				healAmount: 100
			}
		}),
		new PotionDef({
			name: 'hiPotion',
			data: {
				healAmount: 500
			}
		}),
		new ItemDef({
			name: 'rock',
			displayName: 'Sub-Useful Rock',
			isCountLimited: false,
			onUse: function() {
				for (var i = 0; i < EnemyManager.enemies.length; i++) {
					EnemyManager.enemies[i].takeDamage(randIntInc(2,4));
				}
			}
		})
	],

	isItemMaxed: function(def) {
		return def.isCountLimited && def.count >= this.maxItemCount;
	},

	updateButtons: function() {
		var htmlStr = '';
		for (var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			if (item.count > 0) {
				htmlStr += item.getButtonHtml() + '<br />';
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

	this.getButtonHtml = function() {
		return '<button onclick="Inventory.useItem(\'' + this.name + '\')">' + this.displayName + ': ' + formatNumber(this.count) + '</button>';
	};
};

function PotionDef(data) {
	this.__proto__ = new ItemDef(data);
	this.onUse = function() {
		Player.addHealth(this.data.healAmount);
	};
};

