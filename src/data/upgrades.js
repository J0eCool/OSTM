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
			researchCost: 750,
			baseCost: 400,
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
			baseCost: 2000,
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
			baseCost: 5000,
			targetBuilding: 'tent',
			amountIncrease: 40,
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
			baseCost: 10000,
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
			baseCost: 500,
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
			baseCost: 2000,
			targetBuilding: 'cabin',
			amountIncrease: 50,
			prereqs: {
				buildings: {
					'cabin': 1
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
