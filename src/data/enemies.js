function loadEnemies() {
	var enemies = {
		'snake': new EnemyDef({
			displayName: 'Snake',
			image: 'Snake.png',
			health: 22,
			attack: 6,
			reward: {
				xp: 8,
				gold: 5,
			}
		}),
		'slug': new EnemyDef({
			displayName: 'Sloog',
			image: 'SlugSquirrel.png',
			health: 40,
			attack: 4,
			reward: {
				xp: 10,
				gold: 6,
				research: 3,
			}
		}),
		'snake2': new EnemyDef({
			displayName: 'Snake-2',
			image: 'Snake2.png',
			health: 55,
			attack: 7,
			reward: {
				xp: 13,
				gold: 8,
			}
		}),
		'snake3': new EnemyDef({
			displayName: 'Snake-3',
			image: 'Snake3.png',
			health: 255,
			attack: 12,
			reward: {
				xp: 28,
				gold: 45,
				wood: 1.5,
			}
		}),
		'trisnake': new EnemyDef({
			displayName: 'Tri-Snake',
			image: 'TriSnake2.png',
			boss: true,
			health: 750,
			attack: 5,
			reward: {
				xp: 80,
				gold: 25,
				research: 35,
			}
		}),
		'mask': new EnemyDef({
			displayName: 'Masker',
			image: 'MaskBug.png',
			health: 90,
			attack: 8,
			reward: {
				xp: 18,
				gold: 7,
				iron: 3,
			}
		}),
		'snail': new EnemyDef({
			displayName: 'Snale',
			image: 'SpikeSnail.png',
			health: 45,
			attack: 6,
			reward: {
				xp: 15,
				gold: 8,
				research: 4,
			}
		}),
		'snap': new EnemyDef({
			displayName: 'Snapper',
			image: 'SnapPlant.png',
			health: 50,
			attack: 6,
			reward: {
				xp: 18,
				gold: 3,
			}
		}),
	};
	foreach (enemies, function(e, n) {
		e.name = n;
	});
	return enemies;
}
