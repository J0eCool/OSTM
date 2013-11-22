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
			abbrev: 'STR',
			minLevel: 2,
			baseCost: 10,
			levelCost: 5,
			baseValue: 4
		}),
		'dexterity': new StatType({
			displayName: 'Dexterity',
			abbrev: 'DEX',
			minLevel: 10,
			baseCost: 15,
			levelCost: 5,
			baseValue: 5
		}),
		'intelligence': new StatType({
			displayName: 'Intelligence',
			abbrev: 'INT',
			minLevel: 24,
			baseCost: 80,
			levelCost: 7,
			baseValue: 3
		}),
		'defense': new StatType({
			displayName: 'Defense',
			abbrev: 'DEF',
			minLevel: 5,
			baseCost: 25,
			levelCost: 5,
			baseValue: 3
		})
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
		'megaPotion': new PotionDef({
			displayName: 'Mega Potion',
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

function loadEnemies() {
	var enemies = {
		'enemy': new EnemyDef({
			displayName: 'Snake',
			image: 'img/Snake.png',
			health: 22,
			reward: {
				xp: 3,
				gold: 5,
				wood: 2,
			}
		}),
		'wall': new EnemyDef({
			displayName: 'Sloog',
			image: 'img/SlugSquirrel.png',
			health: 40,
			reward: {
				xp: 4,
				gold: 6,
				research: 3,
			}
		}),
		'swirl': new EnemyDef({
			displayName: 'Masker',
			image: 'img/MaskBug.png',
			health: 30,
			attack: 6,
			reward: {
				xp: 6,
				gold: 7,
				iron: 3
			}
		}),
		'snail': new EnemyDef({
			displayName: 'Snale',
			image: 'img/SpikeSnail.png',
			health: 45,
			attack: 6,
			reward: {
				xp: 7,
				research: 4,
				gold: 8
			}
		}),
		'snapplant': new EnemyDef({
			displayName: 'Snapper',
			image: 'img/SnapPlant.png',
			health: 50,
			attack: 6,
			reward: {
				xp: 6,
				wood: 4,
				gold: 3
			}
		}),
		'trisnake': new EnemyDef({
			displayName: 'Tri-Snake',
			image: 'img/TriSnake.png',
			health: 65,
			attack: 7,
			reward: {
				xp: 9,
				research: 5,
				gold: 7
			}
		}),
		'trisnake-boss': new EnemyDef({
			displayName: 'Tri-Snake',
			image: 'img/TriSnake-alt.png',
			boss: true,
			health: 500,
			attack: 6,
			reward: {
				xp: 20,
				research: 25,
				gold: 12
			}
		}),
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
			enemies: ['wall', 'swirl', 'snail', 'snapplant', 'trisnake', 'trisnake-boss'],
		})
	};
	for (var key in adventures) {
		adventures[key].name = key;
	}
	return adventures;
}

function loadBuildings() {
	var researchBuildingCostIncrease = 30;

	var sectionedBuildings = {
		'Residences': {
			'tent': new BuildingDef({
				displayName: 'Tent',
				baseCost: 7500,
				resourcePerSecond: 6
			}),
			'shack': new BuildingDef({
				displayName: 'Shack',
				baseCost: 40000,
				researchCost: 50,
				resourcePerSecond: 20,
				prereqs: {
					buildings: {
						'tent': 0
					}
				}
			}),
			'cabin': new BuildingDef({
				displayName: 'Cabin',
				baseCost: 150000,
				researchCost: 200,
				resourcePerSecond: 65,
				prereqs: {
					buildings: {
						'shack': 0
					}
				}
			}),
			'cottage': new BuildingDef({
				displayName: 'Cottage',
				baseCost: 350000,
				researchCost: 1000,
				resourcePerSecond: 120,
				prereqs: {
					buildings: {
						'cabin': 0
					}
				}
			}),
			'house': new BuildingDef({
				displayName: 'House',
				baseCost: 1500000,
				researchCost: 3500,
				resourcePerSecond: 450,
				prereqs: {
					buildings: {
						'cottage': 0
					}
				}
			}),
			'manor': new BuildingDef({
				displayName: 'Manor',
				baseCost: 6000000,
				researchCost: 12500,
				resourcePerSecond: 1250,
				prereqs: {
					buildings: {
						'house': 0
					}
				}
			})
		},

		'Research': {
			'research-center': new BuildingDef({
				displayName: 'Research Center',
				description: 'Researches new things',
				baseCost: 5000,
				maxCount: 1
			}),
			'library': new BuildingDef({
				displayName: 'Library',
				baseCost: 25000,
				costIncreasePercent: researchBuildingCostIncrease,
				researchCost: 1000,
				resourceProduced: 'research',
				resourcePerSecond: 0.25,
				prereqs: {
					buildings: {
						'research-center': 1
					}
				}
			}),
			'school': new BuildingDef({
				displayName: 'School',
				baseCost: 175000,
				costIncreasePercent: researchBuildingCostIncrease,
				researchCost: 7500,
				resourceProduced: 'research',
				resourcePerSecond: 1,
				prereqs: {
					buildings: {
						'library': 0
					}
				}
			}),
			'university': new BuildingDef({
				displayName: 'University',
				baseCost: 750000,
				costIncreasePercent: researchBuildingCostIncrease,
				researchCost: 100000,
				resourceProduced: 'research',
				resourcePerSecond: 2.5,
				prereqs: {
					buildings: {
						'school': 0
					}
				}
			})
		},

		'Workshops': {
			'blacksmith': new BuildingDef({
				displayName: 'Blacksmith',
				description: 'Sells weapons',
				baseCost: 500,
				maxCount: 1
			}),
			'anvil': new BuildingDef({
				displayName: 'Anvil',
				description: 'Blacksmith can Upgrade weapons',
				researchCost: 100,
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
				researchCost: 2500,
				baseCost: 50000,
				maxCount: 1,
				prereqs: {
					buildings: {
						'anvil': 1
					}
				}
			}),
			'logger': new BuildingDef({
				displayName: 'Logger',
				description: 'Unlocks building upgrades',
				researchCost: 250,
				baseCost: 15000,
				maxCount: 1
			}),
			'training-hall': new BuildingDef({
				displayName: 'Training Hall',
				description: 'Unlocks Skills',
				researchCost: 500,
				baseCost: 25000,
				maxCount: 1
			}),
		}
	};
	var buildings = {};
	foreach (sectionedBuildings, function(section, sectionName) {
		foreach (section, function(item, key) {
			item.name = key;
			item.sectionName = sectionName;
			buildings[key] = item;
		});
	});
	return buildings;
}

function loadUpgrades() {
	var upgrades = {
		'tent-1': new UpgradeDef({
			displayName: 'Big Tents',
			researchCost: 500,
			baseCost: 100,
			targetBuilding: 'tent',
			amountIncrease: 25,
			prereqs: {
				buildings: {
					'tent': 5
				}
			}
		}),
		'tent-2': new UpgradeDef({
			displayName: 'Bigger Tents',
			researchCost: 2000,
			baseCost: 500,
			targetBuilding: 'tent',
			amountIncrease: 50,
			prereqs: {
				buildings: {
					'tent': 10
				},
				upgrades: {
					'tent-1': 1
				}
			}
		})
	};
	foreach (upgrades, function(upgrade, name) {
		upgrade.name = name;
	});
	return upgrades;
}

function loadWeapons() {
	var weapons = {
		'knife': new WeaponDef({
			displayName: 'Knife',
			owned: true,
			mainStat: 'dexterity',
			damage: 5,
			crit: 9,
			upgradeData: {
				crit: 10,
				critDamage: 10
			}
		}),
		'dagger': new WeaponDef({
			displayName: 'Dagger',
			mainStat: 'dexterity',
			buyCost: 500,
			damage: 6,
			crit: 8,
			upgradeData: {
				damage: 5,
				critDamage: 25
			}
		}),
		'shortsword': new WeaponDef({
			displayName: 'Shortsword',
			mainStat: 'dexterity',
			buyCost: 1500,
			damage: 7,
			crit: 5,
			upgradeData: {
				damage: 8,
				crit: 10
			}
		}),
		'longsword': new WeaponDef({
			displayName: 'Longsword',
			mainStat: 'strength',
			buyCost: 5000,
			damage: 8,
			crit: 5,
			upgradeData: {
				damage: 10,
				critDamage: 10
			}
		}),
		'rapier': new WeaponDef({
			displayName: 'Rapier',
			mainStat: 'dexterity',
			buyCost: 7500,
			damage: 8,
			crit: 6.5,
			upgradeData: {
				crit: 12,
				defense: 10
			}
		}),
		'greatsword': new WeaponDef({
			displayName: 'Greatsword',
			mainStat: 'strength',
			buyCost: 15000,
			damage: 10,
			crit: 3,
			upgradeData: {
				damage: 15
			}
		}),
		'greatersword': new WeaponDef({
			displayName: 'Greatersword',
			mainStat: 'strength',
			buyCost: 50000,
			researchCost: 1500,
			damage: 12,
			crit: 5,
			upgradeData: {
				damage: 16,
				defense: 2
			},
			prereqs: {
				buildings: {
					'library': 1
				}
			}
		}),
		'rune-dagger': new WeaponDef({
			displayName: 'Rune Dagger',
			mainStat: 'intelligence',
			buyCost: 250000,
			researchCost: 5000,
			damage: 9,
			crit: 6,
			upgradeData: {
				crit: 8,
				manaRegen: 12
			},
			prereqs: {
				buildings: {
					'training-hall': 1
				}
			}
		})
	};
	foreach (weapons, function(weapon, key) {
		weapon.name = key;
	});
	return weapons;
}

function loadSkills() {
	var skills = {
		'attack': new AttackSkillDef({
			displayName: 'Attack',
			baseDamage: 100,
			levelDamage: 5,
			level: 1
		}),
		'power-attack': new AttackSkillDef({
			displayName: 'Power Attack',
			manaCost: 20,
			baseDamage: 150,
			levelDamage: 15
		}),

		'health-up': new PassiveSkillDef({
			displayName: 'Health Plus',
			statMult: {
				maxHealth: {
					base: 2,
					level: 0.5
				}
			}
		}),
		'mana-up': new PassiveSkillDef({
			displayName: 'Mana Plus',
			statMult: {
				maxMana: {
					base: 5,
					level: 1
				}
			}
		}),
		'focus': new PassiveSkillDef({
			displayName: 'Focus',
			statMult: {
				manaRegen: {
					base: 15,
					level: 3
				}
			}
		}),
		'precision': new PassiveSkillDef({
			displayName: 'Precision',
			statBase: {
				crit: {
					base: 1,
					level: 0.2
				}
			}
		}),
		'cruelty': new PassiveSkillDef({
			displayName: 'Cruelty',
			statBase: {
				critDamage: {
					base: 20,
					level: 4
				}
			},
			statMult: {
				damage: {
					level: 1
				}
			}
		}),
	};

	foreach (skills, function(skill, key) {
		skill.name = key;
	});
	return skills;
}