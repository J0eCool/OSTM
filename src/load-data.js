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
			isCountLimited: false
		}),
		new ItemDef({
			name: 'armor-plus',
			isCountLimited: false
		}),
		new ItemDef({
			name: 'inventory-plus',
			isCountLimited: false
		}),
		new ItemDef({
			name: 'forge-click',
			isCountLimited: false
		}),
		new ItemDef({
			name: 'forge-second',
			isCountLimited: false
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
			},
			onComplete: function() {
				Player.weaponDamage += 1;
			}
		}),
		new Recipe({
			name: 'armor-plus',
			displayName: 'Upgrade Armor',
			baseCost: 50,
			getCost: function() {
				return this.baseCost * (1 + Math.floor(Math.pow(this.itemDef.count, 1.8)));
			},
			onComplete: function() {
				Player.armor += 1;
			}
		}),
		new Recipe({
			name: 'inventory-plus',
			displayName: 'Raise Item Capacity',
			baseCost: 50,
			getCost: function() {
				return this.baseCost * (1 + Math.pow(this.itemDef.count, 2));
			},
			onComplete: function() {
				Inventory.slotsPerItem += 1;
			}
		}),
		new Recipe({
			name: 'forge-click',
			displayName: 'Increase ' + getIconHtml('forge') + ' per Click',
			baseCost: 150,
			currency: 'gold',
			getCost: function() {
				return this.baseCost * (1 + Math.pow(this.itemDef.count, 2));
			},
			onComplete: function() {
				Forge.fillOnClick += this.itemDef.count;
			}
		}),
		new Recipe({
			name: 'forge-second',
			displayName: 'Increase ' + getIconHtml('forge') + ' per Second',
			baseCost: 25,
			currency: 'gold',
			getCost: function() {
				return this.baseCost * (1 + 2 * Math.pow(this.itemDef.count, 2));
			},
			onComplete: function() {
				Forge.fillPerSecond += 1;
			}
		})
	];
}