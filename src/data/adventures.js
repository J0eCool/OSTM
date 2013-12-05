function loadAdventures() {
	var adventures = {
		adv0: new AdventureDef({
			displayName: 'Field',
			areaType: 'grass',
			subAreas: [{
				level: 2
			}, {
				level: 2
			}, {
				level: 3
			}],
			allEnemies: {
				snake: 100
			},
			allLevelRand: 1,
			spawnCountHi: 3,
		}),
		adv1: new AdventureDef({
			prereqs: {
				adventures: ['adv0']
			},
			displayName: 'Plain',
			areaType: 'grass',
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
				snake: 50,
				slug: 50
			},
		}),
		adv2: new AdventureDef({
			prereqs: {
				adventures: ['adv1']
			},
			displayName: 'Grasslands',
			areaType: 'grass',
			subAreas: [{
				level: 8
			}, {
				level: 10
			}, {
				level: 11
			}, {
				level: 11
			}, {
				level: 10,
				enemies: {
					snake3: 8
				}
			}, {
				level: 14,
				useAll: false,
				spawnLo: 1,
				spawnHi: 1,
				enemies: {
					trisnake: 100
				}
			}],
			allEnemies: {
				snake: 40,
				slug: 30,
				snake2: 30,
				snake3: 1,
			},
		}),
		adv3: new AdventureDef({
			prereqs: {
				adventures: ['adv2']
			},
			displayName: 'Desert',
			areaType: 'sand',
			subAreas: [{
				level: 18,
				useAll: false,
				enemies: {
					mask: 100
				}
			}, {
				level: 20
			}, {
				level: 21
			}, {
				level: 23
			}],
			allEnemies: {
				mask: 50,
				shell: 50
			},
		}),
		adv4: new AdventureDef({
			prereqs: {
				adventures: ['adv3']
			},
			displayName: 'Dune',
			areaType: 'sand',
			subAreas: [{
				level: 26,
				useAll: false,
				enemies: {
					mask: 100
				}
			}, {
				level: 29
			}, {
				level: 32
			}],
			allEnemies: {
				mask: 30,
				shell: 40,
				slug2: 30,
			},
		}),
		adv5: new AdventureDef({
			prereqs: {
				adventures: ['adv4']
			},
			displayName: 'Oasis',
			areaType: 'grass',
			subAreas: [{
				level: 35
			}, {
				level: 37
			}],
			allEnemies: {
				snake2: 35,
				slug2: 30,
				shell: 35,
				snake3: 1,
			},
			spawnCountLo: 6,
			spawnCountHi: 7,
		}),
		adv6: new AdventureDef({
			prereqs: {
				adventures: ['adv5']
			},
			displayName: 'Sand Sea',
			areaType: 'sand',
			subAreas: [{
				level: 42
			}, {
				level: 44
			}, {
				level: 45,
				enemies: {
					shell2: 35
				}
			}, {
				level: 45,
				enemies: {
					shell2: 35
				}
			}, {
				level: 44,
				enemies: {
					shell2: 35,
					mask3: 8
				}
			}, {
				level: 49,
				useAll: false,
				spawnLo: 1,
				spawnHi: 1,
				enemies: {
					trisnake2: 100
				}
			}],
			allEnemies: {
				mask2: 45,
				shell: 15,
				slug2: 20,
				mask3: 1,
			},
		}),
		adv7: new AdventureDef({
			prereqs: {
				adventures: ['adv6']
			},
			displayName: 'Oh Shit, There\'s More',
			areaType: 'forest',
			subAreas: [{
				level: 65
			}, {
				level: 85
			}],
			allEnemies: {
				snake2: 35,
				slug2: 30,
				shell: 35,
				snail: 20,
				mask2: 35,
				snake3: 3,
				mask3: 3,
			},
			spawnCountLo: 6,
			spawnCountHi: 9,
		}),
	};
	for (var key in adventures) {
		adventures[key].name = key;
	}
	return adventures;
}
