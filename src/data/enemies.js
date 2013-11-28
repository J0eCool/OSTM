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
