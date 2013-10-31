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
			count: 2,
			data: {
				healAmount: 100
			},
			baseCost: 250,
			currency: 'gold'
		}),
		'hiPotion': new PotionDef({
			displayName: 'Hi-Potion',
			data: {
				healAmount: 500
			},
			baseCost: 5000,
			currency: 'gold'
		}),

		'weapon-plus': new ItemDef({
			storeName: 'Upgrade Weapon',
			isCountLimited: false,
			update: function() {
				Player.weaponDamage = this.count + 2;
			},
			baseCost: 100,
			getCost: function() {
				return this.baseCost * (1 + 2 * Math.floor(Math.pow(this.count, 1.8)));
			}
		}),
		'armor-plus': new ItemDef({
			storeName: 'Upgrade Armor',
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
			isCountLimited: false,
			update: function() {
				Inventory.slotsPerItem = this.count + 5;
			},
			baseCost: 50,
			getCost: function() {
				return this.baseCost * (1 + Math.pow(this.count, 2));
			}
		}),
		'forge-second': new ItemDef({
			storeName: 'Increase ' + getIconHtml('forge') + ' per Second',
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
			baseCost: 35000,
			goldPerSecond: 22
		}),
		'cabin': new BuildingDef({
			displayName: 'Cabin',
			baseCost: 120000,
			goldPerSecond: 75
		}),
		'cottage': new BuildingDef({
			displayName: 'Cottage',
			baseCost: 250000,
			goldPerSecond: 140
		})
	};
	foreach(buildings, function(item, key) {
		item.name = key;
	});
	return buildings;
}
