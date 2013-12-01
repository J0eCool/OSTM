function loadAdventures() {
	var adventures = {
		adv0: new AdventureDef({
			displayName: 'Field',
			subAreas: [{
				level: 2
			}, {
				level: 2
			}, {
				level: 3
			}],
			allEnemies: {
				'enemy': 100
			},
			allLevelRand: 1,
			spawnCountHi: 3,
		}),
		adv1: new AdventureDef({
			prereqs: {
				adventures: ['adv0']
			},
			displayName: 'Plain',
			subAreas: [{
				level: 4
			}, {
				level: 5
			}, {
				level: 5
			}, {
				level: 7
			}],
			allEnemies: {
				'enemy': 50,
				'wall': 50
			},
		}),
		adv2: new AdventureDef({
			prereqs: {
				adventures: ['adv1']
			},
			displayName: 'Grasslands',
			subAreas: [{
				level: 8
			}, {
				level: 10
			}, {
				level: 11
			}, {
				level: 11
			}, {
				level: 14
			}],
			allEnemies: {
				'wall': 30,
				'swirl': 70
			},
		}),
		// 'adv3': new AdventureDef({
		// 	prereqs: {
		// 		adventures: ['adv2']
		// 	},
		// 	displayName: "Oh shit there's more",
		// 	levels: [24, 26, 24, 28, 32, 28, 36, 44],
		// 	enemies: ['wall', 'swirl', 'snail', 'snapplant', 'trisnake', 'trisnake-boss'],
		// })
	};
	for (var key in adventures) {
		adventures[key].name = key;
	}
	return adventures;
}
