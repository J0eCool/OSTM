function loadBuildings() {
	var researchBuildingCostIncrease = 20;
	var ironBuildingCostIncrease = 30;

	var sectionedBuildings = {
		'Residences': {
			'tent': new BuildingDef({
				displayName: 'Tent',
				baseCost: 100,
				resourcePerSecond: 1
			}),
			'shack': new BuildingDef({
				displayName: 'Shack',
				baseCost: 2000,
				resourcePerSecond: 6,
				prereqs: {
					adventures: ['adv1'],
				}
			}),
			'cabin': new BuildingDef({
				displayName: 'Cabin',
				baseCost: 11500,
				resourcePerSecond: 18,
				prereqs: {
					adventures: ['adv1'],
				}
			}),
			'cottage': new BuildingDef({
				displayName: 'Cottage',
				baseCost: 50000,
				researchCost: 750,
				resourcePerSecond: 45,
				prereqs: {
					adventures: ['adv2'],
				}
			}),
			'house': new BuildingDef({
				displayName: 'House',
				baseCost: 320000,
				researchCost: 1500,
				resourcePerSecond: 140,
				prereqs: {
					adventures: ['adv2'],
				}
			}),
			'manor': new BuildingDef({
				displayName: 'Manor',
				baseCost: 2400000,
				researchCost: 5000,
				resourcePerSecond: 500,
				prereqs: {
					adventures: ['adv2'],
				}
			}),
			'dorm': new BuildingDef({
				displayName: 'Dormitory',
				baseCost: 26000000,
				researchCost: 15000,
				resourcePerSecond: 2000,
				prereqs: {
					adventures: ['adv6'],
				}
			}),
			'apartment': new BuildingDef({
				displayName: 'Apartment',
				baseCost: 149000000,
				researchCost: 32500,
				resourcePerSecond: 4500,
				prereqs: {
					adventures: ['adv6'],
				}
			}),
			'condo': new BuildingDef({
				displayName: 'Condominium',
				baseCost: 499950000,
				researchCost: 75000,
				resourcePerSecond: 9500,
				prereqs: {
					adventures: ['adv6'],
				}
			}),
		},

		'Research': {
			'research-center': new BuildingDef({
				displayName: 'Research Center',
				description: 'Researches new things',
				baseCost: 500,
				resourceProduced: 'research',
				resourcePerSecond: 1,
				maxCount: 1
			}),
			'library': new BuildingDef({
				displayName: 'Library',
				baseCost: 25000,
				costIncreasePercent: researchBuildingCostIncrease,
				researchCost: 100,
				resourceProduced: 'research',
				resourcePerSecond: 1,
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
				researchCost: 750,
				resourceProduced: 'research',
				resourcePerSecond: 3,
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
				researchCost: 10000,
				resourceProduced: 'research',
				resourcePerSecond: 5,
				prereqs: {
					buildings: {
						'school': 0
					}
				}
			}),
			'sciFactory': new BuildingDef({
				displayName: 'Science Factory',
				baseCost: 5500000,
				costIncreasePercent: researchBuildingCostIncrease,
				researchCost: 25000,
				resourceProduced: 'research',
				resourcePerSecond: 9,
				prereqs: {
					buildings: {
						'university': 0
					}
				}
			}),
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
			'wizard-tower': new BuildingDef({
				displayName: 'Wizard\'s Tower',
				description: 'Unlocks Spells',
				researchCost: 7500,
				baseCost: 100000,
				maxCount: 1,
				prereqs: {
					buildings: {
						'training-hall': 1
					}
				}
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
