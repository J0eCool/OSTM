function loadUpgrades() {
	var upgrades = {
		'tent-1': new UpgradeDef({
			displayName: 'Big Tents',
			baseCost: 100,
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
			baseCost: 400,
			targetBuilding: 'tent',
			amountIncrease: 50,
			prereqs: {
				buildings: {
					'tent': 5
				},
			}
		}),
		'tent-3': new UpgradeDef({
			displayName: 'Nice Tents',
			researchCost: 700,
			baseCost: 2000,
			targetBuilding: 'tent',
			amountIncrease: 100,
			prereqs: {
				buildings: {
					'tent': 10
				},
			}
		}),
		'tent-4': new UpgradeDef({
			displayName: 'Real Nice Tents',
			researchCost: 1500,
			baseCost: 5000,
			targetBuilding: 'tent',
			amountIncrease: 50,
			prereqs: {
				buildings: {
					'tent': 20
				},
			}
		}),
		'tent-n': new UpgradeDef({
			displayName: 'Infinite Tents',
			researchCost: 50000,
			baseCost: 10000,
			targetBuilding: 'tent',
			amountIncrease: 2,
			maxCount: 0,
			prereqs: {
				buildings: {
					'tent': 50
				}
			}
		}),

		'shack-1': new UpgradeDef({
			displayName: 'Dry Shacks',
			baseCost: 500,
			targetBuilding: 'shack',
			amountIncrease: 50,
			prereqs: {
				buildings: {
					'shack': 1
				}
			}
		}),
		'shack-2': new UpgradeDef({
			displayName: 'Painted Shack',
			baseCost: 3500,
			targetBuilding: 'shack',
			amountIncrease: 75,
			prereqs: {
				buildings: {
					'shack': 10
				}
			}
		}),

		'cabin-1': new UpgradeDef({
			displayName: 'Log Cabins',
			baseCost: 2000,
			targetBuilding: 'cabin',
			amountIncrease: 50,
			prereqs: {
				buildings: {
					'cabin': 1
				}
			}
		}),
		'cabin-2': new UpgradeDef({
			displayName: 'Doors',
			baseCost: 12000,
			targetBuilding: 'cabin',
			amountIncrease: 100,
			prereqs: {
				buildings: {
					'cabin': 10
				}
			}
		}),

		'cottage-1': new UpgradeDef({
			displayName: 'Fireplaces',
			baseCost: 5000,
			targetBuilding: 'cottage',
			amountIncrease: 50,
			prereqs: {
				buildings: {
					'cottage': 1
				}
			}
		}),
		'cottage-2': new UpgradeDef({
			displayName: 'Chimneys',
			baseCost: 40000,
			targetBuilding: 'cottage',
			amountIncrease: 100,
			prereqs: {
				buildings: {
					'cottage': 10
				}
			}
		}),
		'cottage-3': new UpgradeDef({
			displayName: 'Cozy Fireplaces',
			baseCost: 180000,
			targetBuilding: 'cottage',
			amountIncrease: 50,
			prereqs: {
				buildings: {
					'cottage': 20
				}
			}
		}),

		'house-1': new UpgradeDef({
			displayName: 'Windows',
			baseCost: 15000,
			targetBuilding: 'house',
			amountIncrease: 50,
			prereqs: {
				buildings: {
					'house': 1
				}
			}
		}),
		'house-2': new UpgradeDef({
			displayName: 'Decks',
			baseCost: 125000,
			targetBuilding: 'house',
			amountIncrease: 100,
			prereqs: {
				buildings: {
					'house': 10
				}
			}
		}),

		'manor-1': new UpgradeDef({
			displayName: 'Landscaping',
			baseCost: 50000,
			targetBuilding: 'manor',
			amountIncrease: 50,
			prereqs: {
				buildings: {
					'manor': 1
				}
			}
		}),
		'manor-2': new UpgradeDef({
			displayName: 'Serfs',
			baseCost: 650000,
			targetBuilding: 'manor',
			amountIncrease: 100,
			prereqs: {
				buildings: {
					'manor': 10
				}
			}
		}),

		'library-1': new UpgradeDef({
			displayName: 'Card Catalogs',
			baseCost: 1200,
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
