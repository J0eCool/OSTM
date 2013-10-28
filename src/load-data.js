function loadItems() {
	return [
		new PotionDef({
			name: 'potion',
			count: 2,
			data: {
				healAmount: 100
			},
			maxPerInvSlot: 2
		}),
		new PotionDef({
			name: 'hiPotion',
			data: {
				healAmount: 500
			}
		}),

		new ItemDef({
			name: 'weapon-plus',
			isCountLimited: false,
			update: function() {
				Player.weaponDamage = this.count + 2;
			}
		}),
		new ItemDef({
			name: 'armor-plus',
			isCountLimited: false,
			update: function() {
				Player.armor = this.count + 2;
			}
		}),
		new ItemDef({
			name: 'inventory-plus',
			isCountLimited: false,
			update: function() {
				Inventory.slotsPerItem = this.count + 5;
			}
		}),
		new ItemDef({
			name: 'forge-click',
			isCountLimited: false,
			update: function() {
				Forge.fillOnClick = (this.count + 1) * (this.count + 2) / 2;
			}
		}),
		new ItemDef({
			name: 'forge-second',
			isCountLimited: false,
			update: function() {
				Forge.fillPerSecond = this.count;
			}
		})
	];
}

function loadRecipes() {
	return [
		new Recipe({
			name: 'potion',
			baseCost: 25
		}),
		new Recipe({
			name: 'hiPotion',
			baseCost: 100
		}),

		new Recipe({
			name: 'weapon-plus',
			displayName: 'Upgrade Weapon',
			baseCost: 100,
			getCost: function() {
				return this.baseCost * (1 + 2 * Math.floor(Math.pow(this.itemDef.count, 1.8)));
			}
		}),
		new Recipe({
			name: 'armor-plus',
			displayName: 'Upgrade Armor',
			baseCost: 50,
			getCost: function() {
				return this.baseCost * (1 + Math.floor(Math.pow(this.itemDef.count, 1.8)));
			}
		}),
		new Recipe({
			name: 'inventory-plus',
			displayName: 'Raise Item Capacity',
			baseCost: 50,
			getCost: function() {
				return this.baseCost * (1 + Math.pow(this.itemDef.count, 2));
			}
		}),
		new Recipe({
			name: 'forge-click',
			displayName: 'Increase ' + getIconHtml('forge') + ' per Click',
			baseCost: 150,
			currency: 'gold',
			getCost: function() {
				return this.baseCost * (1 + Math.pow(this.itemDef.count, 2));
			}
		}),
		new Recipe({
			name: 'forge-second',
			displayName: 'Increase ' + getIconHtml('forge') + ' per Second',
			baseCost: 25,
			currency: 'gold',
			getCost: function() {
				return this.baseCost * (1 + 2 * Math.pow(this.itemDef.count, 2));
			}
		})
	];
}