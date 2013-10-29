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
			maxPerInvSlot: 2,
			baseCost: 25
		}),
		'hiPotion': new PotionDef({
			displayName: 'Hi-Potion',
			data: {
				healAmount: 500
			},
			baseCost: 100
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
		'forge-click': new ItemDef({
			storeName: 'Increase ' + getIconHtml('forge') + ' per Click',
			isCountLimited: false,
			update: function() {
				Forge.fillOnClick = Math.floor(1 + this.count + Math.pow(this.count, 2) / 3);
			},
			baseCost: 100,
			currency: 'gold',
			getCost: function() {
				return Math.floor(this.baseCost * (1 + 3 * this.count + 1.75 * Math.pow(this.count, 2)));
			}
		}),
		'forge-second': new ItemDef({
			storeName: 'Increase ' + getIconHtml('forge') + ' per Second',
			isCountLimited: false,
			update: function() {
				Forge.fillPerSecond = this.count;
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
			name: 'Enemy',
			image: 'img/Shroomie.png',
			health: 22,
			gold: 3
		}),
		'wall': new EnemyDef({
			name: 'Wall',
			image: 'img/Bricks.png',
			health: 40,
			xp: 4,
			forge: 2,
			gold: 4,
		}),
		'swirl': new EnemyDef({
			minLevel: 3,
			name: 'Swirl',
			image: 'img/CircleTestPattern.png',
			health: 30,
			attack: 6,
			xp: 6,
			forge: 3,
			gold: 5
		})
	};
	return enemies;
}

function loadAdventures() {
	var adventures = {
		'adv0': new AdventureDef({
			displayName: 'Field',
			levels: [2, 2, 3],
			enemies: ['Enemy'],
			spawnCountHi: 3
		}),
		'adv1': new AdventureDef({
			displayName: 'OtherField',
			levels: [4, 6, 6, 8],
			enemies: ['Enemy', 'Wall'],
			prereq: 'adv0'
		}),
		'adv2': new AdventureDef({
			displayName: 'Third Area',
			levels: [12, 16, 18, 18, 18, 22],
			enemies: ['Wall', 'Swirl'],
			prereq: 'adv1'
		})
	};
	for (var key in adventures) {
		adventures[key].name = key;
	}
	return adventures;
}
