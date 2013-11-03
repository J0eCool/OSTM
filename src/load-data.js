function loadStats() {
	var stats = {
		'maxHealth': new StatType({
			displayName: 'Health',
			baseCost: 5,
			levelCost: 2.5,
			baseValue: 100,
			levelValue: 10,

			getBaseValueAtLevel: function(level) {
				return this.baseValue + level * (this.levelValue + level - 1);
			},

			onUpgrade: function() {
				//technically not correct but it rounds up and is close
				Player.regenHealth(this.upgradeValue());
			}
		}),
		'strength': new StatType({
			statName: 'Strength',
			minLevel: 2,
			baseCost: 10,
			levelCost: 5,
			baseValue: 4
		}),
		'defense': new StatType({
			statName: 'Defense',
			minLevel: 5,
			baseCost: 25,
			levelCost: 5,
			baseValue: 3
		}),
		'itemEfficiency': new StatType({
			statName: 'itemEfficiency',
			displayName: 'Item Efficiency',
			minLevel: 8,
			baseCost: 100,
			levelCost: 50,
			baseValue: 100,
			levelValue: 20,
			isPercent: true
		}),
		'healthRegen': new StatType ({
			statName: 'healthRegen',
			displayName: 'Health Regen',
			minLevel: 15,
			baseCost: 400,
			levelCost: 350,
			baseValue: 1,
			levelValue: 1,
			isPercent: true,
			stringPostfix: '%/sec'
		}),
	};
	for (var key in stats) {
		stats[key].name = key;
	}
	return stats;
}

function loadItems() {
	var items = {
		'potion': new PotionDef({
			displayName: 'Potion',
			description: 'Restores 100 HP',
			count: 2,
			data: {
				healAmount: 100
			},
			baseCost: 250,
			currency: 'gold'
		}),
		'hiPotion': new PotionDef({
			displayName: 'Hi-Potion',
			description: 'Restores 500 HP',
			data: {
				healAmount: 500
			},
			baseCost: 5000,
			currency: 'gold'
		}),

		'armor-plus': new ItemDef({
			storeName: 'Upgrade Armor',
			description: 'Increases Armor by 1',
			isCountLimited: false,
			update: function() {
				Player.armor = this.count + 2;
			},
			baseCost: 50,
			getCost: function() {
				return this.baseCost * (1 + Math.floor(Math.pow(this.count, 1.8)));
			}
		}),
		'inventory-plus': new ItemDef({
			storeName: 'Raise Item Capacity',
			description: 'Increases the number of items you can carry by 1',
			isCountLimited: false,
			update: function() {
				Inventory.slotsPerItem = this.count + 3;
			},
			baseCost: 100,
			getCost: function() {
				return this.baseCost * (1 + Math.pow(this.count, 3));
			}
		}),
		'forge-second': new ItemDef({
			storeName: 'Increase ' + getIconHtml('forge') + ' per Second',
			description: 'Gives passive ' + getIconHtml('forge') + ' over time',
			isCountLimited: false,
			update: function() {
				Inventory.forgePerSecond = this.count;
			},
			baseCost: 250,
			currency: 'gold',
			getCost: function() {
				return Math.floor(this.baseCost * (1 + 2 * Math.pow(this.count, 2.5)));
			}
		})
	};
	for (var key in items) {
		items[key].name = key;
	}
	return items;
}

function loadEnemies() {
	var enemies = {
		'enemy': new EnemyDef({
			displayName: 'Enemy',
			image: 'img/Shroomie.png',
			health: 22,
			gold: 5
		}),
		'wall': new EnemyDef({
			displayName: 'Wall',
			image: 'img/Bricks.png',
			health: 40,
			xp: 4,
			forge: 2,
			gold: 6,
		}),
		'swirl': new EnemyDef({
			minLevel: 3,
			displayName: 'Swirl',
			image: 'img/CircleTestPattern.png',
			health: 30,
			attack: 6,
			xp: 6,
			forge: 3,
			gold: 7
		})
	};
	foreach (enemies, function(e, n) {
		e.name = n;
	});
	return enemies;
}

function loadAdventures() {
	var adventures = {
		'adv0': new AdventureDef({
			displayName: 'Field',
			levels: [2, 2, 3],
			enemies: ['enemy'],
			spawnCountHi: 3,
		}),
		'adv1': new AdventureDef({
			prereq: 'adv0',
			displayName: 'OtherField',
			levels: [4, 6, 6, 8],
			enemies: ['enemy', 'wall'],
		}),
		'adv2': new AdventureDef({
			prereq: 'adv1',
			displayName: 'Third Area',
			levels: [12, 16, 18, 18, 18, 22],
			enemies: ['wall', 'swirl'],
		}),
		'adv3': new AdventureDef({
			prereq: 'adv2',
			displayName: "Oh shit there's more",
			levels: [24, 26, 24, 28, 32],
			enemies: ['enemy', 'wall', 'swirl'],
		})
	};
	for (var key in adventures) {
		adventures[key].name = key;
	}
	return adventures;
}

function loadBuildings() {
	var buildings = {
		'tent': new BuildingDef({
			displayName: 'Tent',
			baseCost: 7500,
			goldPerSecond: 6
		}),
		'shack': new BuildingDef({
			displayName: 'Shack',
			baseCost: 40000,
			goldPerSecond: 20
		}),
		'cabin': new BuildingDef({
			displayName: 'Cabin',
			baseCost: 150000,
			goldPerSecond: 65
		}),
		'cottage': new BuildingDef({
			displayName: 'Cottage',
			baseCost: 350000,
			goldPerSecond: 120
		})
	};
	foreach(buildings, function(item, key) {
		item.name = key;
	});
	return buildings;
}

function loadWeapons() {
	var weapons = {
		'knife': new WeaponDef({
			displayName: 'Knife',
			owned: true,
			damage: 3,
			crit: 7,
			upgradeData: {
				crit: 10,
				critDamage: 5
			}
		}),
		'dagger': new WeaponDef({
			displayName: 'Dagger',
			buyCost: 2500,
			damage: 5,
			crit: 7,
			upgradeData: {
				damage: 5,
				critDamage: 10
			}
		}),
		'shortsword': new WeaponDef({
			displayName: 'Shortsword',
			buyCost: 10000,
			damage: 7,
			crit: 5,
			upgradeData: {
				damage: 8,
				crit: 5
			}
		}),
		'longsword': new WeaponDef({
			displayName: 'Dagger',
			buyCost: 25000,
			damage: 9,
			crit: 5,
			upgradeData: {
				damage: 10,
				critDamage: 5
			}
		}),
		'basket-sword': new WeaponDef({
			displayName: 'Basket-Hilted Broadsword',
			buyCost: 50000,
			damage: 9,
			crit: 5,
			upgradeData: {
				damage: 5,
				defense: 10
			}
		}),
		'greatsword': new WeaponDef({
			displayName: 'Greatsword',
			buyCost: 125000,
			damage: 11,
			crit: 4,
			upgradeData: {
				damage: 15
			}
		})
	};
	foreach (weapons, function(weapon, key) {
		weapon.name = key;
	});
	return weapons;
}
