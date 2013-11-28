function loadStats() {
	var stats = {
		'maxHealth': new StatType({
			displayName: 'Health',
			baseValue: 100,
			levelValue: 20,

			onUpgrade: function() {
				//technically not correct but it rounds up and is close
				Player.regenHealth(this.upgradeValue());
			}
		}),
		'maxMana': new StatType({
			displayName: 'Mana',
			minLevel: 24,
			baseValue: 40,
			levelValue: 5,

			onUpgrade: function() {
				Player.regenMana(this.upgradeValue());
			}
		}),
		'strength': new StatType({
			displayName: 'Strength',
			abbrev: 'STR',
			minLevel: 10,
			baseValue: 4
		}),
		'dexterity': new StatType({
			displayName: 'Dexterity',
			abbrev: 'DEX',
			minLevel: 2,
			baseValue: 5
		}),
		'intelligence': new StatType({
			displayName: 'Intelligence',
			abbrev: 'INT',
			minLevel: 24,
			baseValue: 3
		}),
		'defense': new StatType({
			displayName: 'Defense',
			abbrev: 'DEF',
			minLevel: 5,
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
			image: 'Snake.png',
			health: 22,
			reward: {
				xp: 8,
				gold: 5,
				wood: 2,
			}
		}),
		'wall': new EnemyDef({
			displayName: 'Sloog',
			image: 'SlugSquirrel.png',
			health: 40,
			reward: {
				xp: 10,
				gold: 6,
				research: 3,
			}
		}),
		'swirl': new EnemyDef({
			displayName: 'Masker',
			image: 'MaskBug.png',
			health: 30,
			attack: 6,
			reward: {
				xp: 12,
				gold: 7,
				iron: 3
			}
		}),
		'snail': new EnemyDef({
			displayName: 'Snale',
			image: 'SpikeSnail.png',
			health: 45,
			attack: 6,
			reward: {
				xp: 15,
				research: 4,
				gold: 8
			}
		}),
		'snapplant': new EnemyDef({
			displayName: 'Snapper',
			image: 'SnapPlant.png',
			health: 50,
			attack: 6,
			reward: {
				xp: 18,
				wood: 4,
				gold: 3
			}
		}),
		'trisnake': new EnemyDef({
			displayName: 'Tri-Snake',
			image: 'TriSnake.png',
			health: 65,
			attack: 7,
			reward: {
				xp: 20,
				research: 5,
				gold: 7
			}
		}),
		'trisnake-boss': new EnemyDef({
			displayName: 'Tri-Snake Boss',
			image: 'TriSnake-alt.png',
			boss: true,
			health: 500,
			attack: 6,
			reward: {
				xp: 25,
				research: 50,
				gold: 20
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
			levels: [4, 5, 5, 7],
			enemies: ['enemy', 'wall'],
		}),
		'adv2': new AdventureDef({
			prereqs: {
				adventures: ['adv1']
			},
			displayName: 'Third Area',
			levels: [8, 10, 11, 11, 14],
			enemies: ['wall', 'swirl'],
		}),
		'adv3': new AdventureDef({
			prereqs: {
				adventures: ['adv2']
			},
			displayName: "Oh shit there's more",
			levels: [24, 26, 24, 28, 32, 28, 36, 44],
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
	var ironBuildingCostIncrease = 50;

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
			'foundry': new BuildingDef({
				displayName: 'Foundry',
				researchCost: 5000,
				baseCost: 250000,
				costIncreasePercent: ironBuildingCostIncrease,
				resourceProduced: 'iron',
				resourcePerSecond: 3,
				prereqs: {
					buildings: {
						'forge': 1
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
			baseCost: 1000,
			targetBuilding: 'tent',
			amountIncrease: 50,
			prereqs: {
				buildings: {
					'tent': 1
				}
			}
		}),
		'tent-2': new UpgradeDef({
			displayName: 'Bigger Tents',
			researchCost: 750,
			baseCost: 5000,
			targetBuilding: 'tent',
			amountIncrease: 50,
			prereqs: {
				buildings: {
					'tent': 5
				},
				upgrades: {
					'tent-1': 1
				}
			}
		}),
		'tent-3': new UpgradeDef({
			displayName: 'Nice Tents',
			researchCost: 2000,
			baseCost: 50000,
			targetBuilding: 'tent',
			amountIncrease: 100,
			prereqs: {
				buildings: {
					'tent': 10
				},
				upgrades: {
					'tent-2': 1
				}
			}
		}),
		'tent-4': new UpgradeDef({
			displayName: 'Real Nice Tents',
			researchCost: 5000,
			baseCost: 250000,
			targetBuilding: 'tent',
			amountIncrease: 30,
			prereqs: {
				buildings: {
					'tent': 25
				},
				upgrades: {
					'tent-3': 1
				}
			}
		}),
		'tent-n': new UpgradeDef({
			displayName: 'Infinite Tents',
			researchCost: 50000,
			baseCost: 100000,
			targetBuilding: 'tent',
			amountIncrease: 2,
			maxCount: 0,
			prereqs: {
				buildings: {
					'tent': 5
				}
			}
		}),

		'shack-1': new UpgradeDef({
			displayName: 'Dry Shacks',
			baseCost: 50000,
			targetBuilding: 'shack',
			amountIncrease: 50,
			prereqs: {
				buildings: {
					'shack': 1
				}
			}
		}),

		'cabin-1': new UpgradeDef({
			displayName: 'Log Cabins',
			baseCost: 250000,
			targetBuilding: 'cabin',
			amountIncrease: 30,
			prereqs: {
				buildings: {
					'cabin': 1
				}
			}
		}),

		'library-1': new UpgradeDef({
			displayName: 'Card Catalogs',
			baseCost: 50000,
			targetBuilding: 'library',
			amountIncrease: 100,
			prereqs: {
				buildings: {
					'library': 1
				}
			}
		}),
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
			scalingBase: {
				strength: 5,
				dexterity: 70
			},
			damage: 5,
			crit: 9,
			upgradeData: {
				crit: 10,
				critDamage: 10
			}
		}),
		'dagger': new WeaponDef({
			displayName: 'Dagger',
			scalingBase: {
				strength: 10,
				dexterity: 55
			},
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
			scalingBase: {
				strength: 25,
				dexterity: 40
			},
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
			scalingBase: {
				strength: 45,
				dexterity: 30
			},
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
			scalingBase: {
				strength: 20,
				dexterity: 60
			},
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
			scalingBase: {
				strength: 80
			},
			buyCost: 15000,
			damage: 10,
			crit: 3,
			upgradeData: {
				damage: 15
			}
		}),
		'greatersword': new WeaponDef({
			displayName: 'Greatersword',
			scalingBase: {
				strength: 85,
				dexterity: 20
			},
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
					'research-center': 1
				}
			}
		}),
		'shamshir': new WeaponDef({
			displayName: 'Shamshir',
			scalingBase: {
				strength: 20,
				dexterity: 85
			},
			buyCost: 50000,
			researchCost: 1500,
			damage: 11,
			crit: 6,
			upgradeData: {
				damage: 8,
				crit: 8,
				critDamage: 10
			},
			prereqs: {
				buildings: {
					'research-center': 1
				}
			}
		}),
		'rune-dagger': new WeaponDef({
			displayName: 'Rune Dagger',
			scalingBase: {
				dexterity: 40,
				intelligence: 30
			},
			buyCost: 250000,
			researchCost: 5000,
			damage: 9,
			crit: 6,
			spellPower: 20,
			upgradeData: {
				crit: 8,
				manaRegen: 12
			},
			prereqs: {
				buildings: {
					'training-hall': 1
				}
			}
		}),
		'wand': new WeaponDef({
			displayName: 'Wand',
			scalingBase: {
				intelligence: 50
			},
			buyCost: 250000,
			researchCost: 5000,
			damage: 7,
			crit: 3,
			spellPower: 50,
			upgradeData: {
				spellPower: 8,
				maxMana: 5
			},
			prereqs: {
				buildings: {
					'training-hall': 1
				}
			}
		}),
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
			scalingBase: {
				strength: 1
			},
			manaCost: 15,
			baseDamage: 150,
			levelDamage: 25
		}),
		'quick-attack': new AttackSkillDef({
			displayName: 'Quick Attack',
			scalingBase: {
				dexterity: 2.5
			},
			manaCost: 15,
			baseDamage: 140,
			levelDamage: 20
		}),

		'magic-missile': new SpellSkillDef({
			displayName: 'Magic Missile',
			scalingBase: {
				intelligence: 10
			},
			manaCost: 5,
			baseDamage: 80,
			levelDamage: 20
		}),

		'health-up': new PassiveSkillDef({
			displayName: 'Health Plus',
			statMult: {
				maxHealth: {
					base: 10,
					level: 5
				}
			}
		}),
		'fortitude': new PassiveSkillDef({
			displayName: 'Fortitude',
			statMult: {
				healthRegen: {
					base: 20,
					level: 5
				}
			}
		}),
		'heartiness': new PassiveSkillDef({
			displayName: 'Heartiness',
			statBase: {
				healthRegen: {
					base: 1,
					level: 0.1
				}
			}
		}),
		'mana-up': new PassiveSkillDef({
			displayName: 'Mana Plus',
			statMult: {
				maxMana: {
					base: 12,
					level: 6
				}
			}
		}),
		'focus': new PassiveSkillDef({
			displayName: 'Focus',
			statMult: {
				manaRegen: {
					base: 25,
					level: 6
				}
			}
		}),
		'crystal-mind': new PassiveSkillDef({
			displayName: 'Crystal Mind',
			statBase: {
				manaRegen: {
					base: 1.5,
					level: 0.15
				}
			}
		}),
		'precision': new PassiveSkillDef({
			displayName: 'Precision',
			statBase: {
				crit: {
					base: 1,
					level: 0.1
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
		'power': new PassiveSkillDef({
			displayName: 'Power',
			statMult: {
				damage: {
					base: 1,
					level: 1
				},
				spellPower: {
					base: 1,
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
