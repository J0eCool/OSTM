function loadItems() {
	var items = {
		'potion': new PotionDef({
			displayName: 'Potion',
			count: 2,
			data: {
				healAmount: 100
			},
			baseCost: 250
		}),
		'hiPotion': new PotionDef({
			displayName: 'Hi-Potion',
			data: {
				healAmount: 500
			},
			baseCost: 5000,
			researchCost: 250,
			prereqs: {
				adventures: ['adv1']
			}
		}),
		'superPotion': new PotionDef({
			displayName: 'Super Potion',
			data: {
				healAmount: 2500
			},
			baseCost: 100000,
			researchCost: 1500,
			prereqs: {
				adventures: ['adv2'],
				items: ['hiPotion']
			}
		}),
		'megaPotion': new PotionDef({
			displayName: 'Mega Potion',
			data: {
				healAmount: 15000
			},
			baseCost: 3500000,
			researchCost: 5000,
			prereqs: {
				adventures: ['adv3'],
				items: ['superPotion']
			}
		}),

		'armor-plus': new ItemDef({
			storeName: 'Upgrade Armor',
			description: 'Increases Armor by 1',
			isCountLimited: false,
			update: function() {
				Player.armor = this.count + 2;
			},
			baseCost: 50,
			currency: 'iron',
			getCost: function() {
				return this.baseCost * (1 + Math.floor(Math.pow(this.count, 1.8)));
			},
			prereqs: {
				buildings: {
					'forge': 1
				}
			}
		}),
		'inventory-plus': new ItemDef({
			storeName: 'Raise Item Capacity',
			description: 'Increases the number of items you can carry by 1',
			isCountLimited: false,
			update: function() {
				Inventory.slotsPerItem = this.count + 3;
			},
			baseCost: 500,
			currency: 'iron',
			getCost: function() {
				return this.baseCost * Math.pow(10, this.count);
			},
			prereqs: {
				buildings: {
					'forge': 1
				}
			}
		})
	};
	for (var key in items) {
		items[key].name = key;
	}
	return items;
}
