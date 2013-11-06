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
			displayName: 'Strength',
			minLevel: 2,
			baseCost: 10,
			levelCost: 5,
			baseValue: 4
		}),
		'defense': new StatType({
			displayName: 'Defense',
			minLevel: 5,
			baseCost: 25,
			levelCost: 5,
			baseValue: 3
		}),
		'itemEfficiency': new StatType({
			displayName: 'Item Efficiency',
			minLevel: 8,
			baseCost: 100,
			levelCost: 50,
			baseValue: 100,
			levelValue: 20,
			isPercent: true
		}),
		'healthRegen': new StatType ({
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
			baseCost: 250
		}),
		'hiPotion': new PotionDef({
			displayName: 'Hi-Potion',
			description: 'Restores 500 HP',
			data: {
				healAmount: 500
			},
			baseCost: 5000,
			researchCost: 250,
			prereqs: {
				adventures: ['adv1']
			}
		}),
		'megaPotion': new PotionDef({
			displayName: 'Mega Potion',
			description: 'Restores 2500 HP',
			data: {
				healAmount: 500
			},
			baseCost: 100000,
			researchCost: 5000,
			prereqs: {
				adventures: ['adv2'],
				items: ['hiPotion']
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
			currency: 'forge',
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
			baseCost: 500,
			currency: 'forge',
			getCost: function() {
				return this.baseCost * Math.pow(10, this.count);
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
			displayName: 'Snake',
			image: 'img/Snake.png',
			health: 22,
			gold: 5
		}),
		'wall': new EnemyDef({
			displayName: 'Sloog',
			image: 'img/SlugSquirrel.png',
			health: 40,
			xp: 4,
			forge: 2,
			gold: 6,
		}),
		'swirl': new EnemyDef({
			displayName: 'Masker',
			image: 'img/MaskBug.png',
			health: 30,
			attack: 6,
			xp: 6,
			forge: 3,
			gold: 7
		}),
		'snail': new EnemyDef({
			displayName: 'Snale',
			image: 'img/SpikeSnail.png',
			health: 45,
			attack: 6,
			xp: 7,
			forge: 2,
			gold: 8
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
			prereqs: {
				adventures: ['adv0']
			},
			displayName: 'OtherField',
			levels: [4, 6, 6, 8],
			enemies: ['enemy', 'wall'],
		}),
		'adv2': new AdventureDef({
			prereqs: {
				adventures: ['adv1']
			},
			displayName: 'Third Area',
			levels: [12, 16, 18, 18, 18, 22],
			enemies: ['wall', 'swirl'],
		}),
		'adv3': new AdventureDef({
			prereqs: {
				adventures: ['adv2']
			},
			displayName: "Oh shit there's more",
			levels: [24, 26, 24, 28, 32],
			enemies: ['enemy', 'wall', 'swirl', 'snail'],
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
			researchCost: 500,
			goldPerSecond: 20,
			prereqs: {
				buildings: {
					'tent': 0
				}
			}
		}),
		'cabin': new BuildingDef({
			displayName: 'Cabin',
			baseCost: 150000,
			researchCost: 2000,
			goldPerSecond: 65,
			prereqs: {
				buildings: {
					'shack': 0
				}
			}
		}),
		'cottage': new BuildingDef({
			displayName: 'Cottage',
			baseCost: 350000,
			researchCost: 10000,
			goldPerSecond: 120,
			prereqs: {
				buildings: {
					'cabin': 0
				}
			}
		}),

		// non-gold buildings
		'blacksmith': new BuildingDef({
			displayName: 'Blacksmith',
			description: 'Sells weapons',
			baseCost: 500,
			maxCount: 1
		}),
		'anvil': new BuildingDef({
			displayName: 'Anvil',
			description: 'Blacksmith can Upgrade weapons',
			researchCost: 1000,
			baseCost: 25000,
			maxCount: 1,
			prereqs: {
				buildings: {
					'blacksmith': 1
				}
			}
		}),
		'forge': new BuildingDef({
			displayName: 'Mystic Forge',
			description: 'Blacksmith can Ascend max-level weapons',
			researchCost: 5000,
			baseCost: 50000,
			maxCount: 1,
			prereqs: {
				buildings: {
					'anvil': 1
				}
			}
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
			crit: 9,
			upgradeData: {
				crit: 10,
				critDamage: 5
			}
		}),
		'dagger': new WeaponDef({
			displayName: 'Dagger',
			buyCost: 500,
			damage: 5,
			crit: 8,
			upgradeData: {
				damage: 5,
				critDamage: 10
			}
		}),
		'shortsword': new WeaponDef({
			displayName: 'Shortsword',
			buyCost: 1500,
			damage: 7,
			crit: 5,
			upgradeData: {
				damage: 8,
				crit: 5
			}
		}),
		'longsword': new WeaponDef({
			displayName: 'Longsword',
			buyCost: 5000,
			damage: 9,
			crit: 5,
			upgradeData: {
				damage: 10,
				critDamage: 5
			}
		}),
		'rapier': new WeaponDef({
			displayName: 'Rapier',
			buyCost: 7500,
			damage: 9,
			crit: 7,
			upgradeData: {
				crit: 5,
				defense: 10
			}
		}),
		'greatsword': new WeaponDef({
			displayName: 'Greatsword',
			buyCost: 15000,
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
