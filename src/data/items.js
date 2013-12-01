function loadItems() {
	var items = {
		'potion': new PotionDef({
			displayName: 'Potion',
			count: 2,
			healAmount: 100,
			baseCost: 250
		}),
		'hiPotion': new PotionDef({
			displayName: 'Hi-Potion',
			healAmount: 500,
			baseCost: 5000,
			researchCost: 250,
			prereqs: {
				adventures: ['adv1']
			}
		}),
		'superPotion': new PotionDef({
			displayName: 'Super Potion',
			healAmount: 2500,
			baseCost: 100000,
			researchCost: 1500,
			prereqs: {
				adventures: ['adv2'],
				items: ['hiPotion']
			}
		}),
		'megaPotion': new PotionDef({
			displayName: 'Mega Potion',
			healAmount: 15000,
			baseCost: 3500000,
			researchCost: 5000,
			prereqs: {
				adventures: ['adv3'],
				items: ['superPotion']
			}
		}),
		'ether': new PotionDef({
			displayName: 'Ether',
			manaAmount: 75,
			baseCost: 10000,
			researchCost: 1000,
			prereqs: {
				items: ['hiPotion']
			}
		}),
		'hiEther': new PotionDef({
			displayName: 'Hi-Ether',
			manaAmount: 300,
			baseCost: 180000,
			researchCost: 5000,
			prereqs: {
				adventures: ['adv3'],
				items: ['ether']
			}
		}),
		'elixir': new PotionDef({
			displayName: 'Elixir',
			healAmount: 1500,
			manaAmount: 200,
			baseCost: 150000,
			researchCost: 15000,
			prereqs: {
				adventures: ['adv4'],
				items: ['superPotion', 'hiEther']
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
