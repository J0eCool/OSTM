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

function loadEnemies() {
	return [
		new EnemyDef({
			name: 'Enemy',
			image: 'img/Shroomie.png',
			health: 22,
			gold: 3
		}),
		new EnemyDef({
			name: 'Wall',
			image: 'img/Bricks.png',
			health: 40,
			xp: 4,
			forge: 2,
			gold: 4,
		}),
		new EnemyDef({
			minLevel: 3,
			name: 'Swirl',
			image: 'img/CircleTestPattern.png',
			health: 30,
			attack: 6,
			xp: 6,
			forge: 3,
			gold: 5
		})
	];
}

function loadAdventures() {
	var adventures = {
		adv0: new AdventureDef({
			displayName: 'Field',
			levels: [5, 6, 6],
			enemies: ['Enemy'],
			spawnCountHi: 3
		}),
		adv1: new AdventureDef({
			displayName: 'OtherField',
			levels: [8, 10, 9, 12],
			enemies: ['Enemy', 'Wall'],
			prereq: 'adv0'
		}),
		adv2: new AdventureDef({
			displayName: 'Third Area',
			levels: [15, 18, 23, 26, 30],
			enemies: ['Wall', 'Swirl'],
			prereq: 'adv1'
		})
	};
	for (var key in adventures) {
		adventures[key].name = key;
	}
	return adventures;
}
