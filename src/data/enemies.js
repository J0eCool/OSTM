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
			displayName: 'TriSnake',
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
		'shell': new EnemyDef({
			displayName: 'Sheller',
			image: 'ShellBug.png',
			health: 110,
			attack: 7,
			reward: {
				xp: 19,
				gold: 11,
			}
		}),
		'slug2': new EnemyDef({
			displayName: 'Sloog-2',
			image: 'SlugSquirrel2.png',
			health: 140,
			attack: 7,
			reward: {
				xp: 24,
				gold: 9,
				research: 6,
			}
		}),
		'mask2': new EnemyDef({
			displayName: 'Masker-2',
			image: 'MaskBug2.png',
			health: 160,
			attack: 11,
			reward: {
				xp: 24,
				gold: 11,
				iron: 4.5,
			}
		}),
		'mask3': new EnemyDef({
			displayName: 'Masker-3',
			image: 'MaskBug3.png',
			health: 1200,
			attack: 20,
			reward: {
				xp: 70,
				gold: 27,
				iron: 23,
				wood: 2.4,
			}
		}),
		'trisnake2': new EnemyDef({
			displayName: 'TriSnake-2',
			image: 'TriSnake.png',
			boss: true,
			health: 2750,
			attack: 18,
			reward: {
				xp: 180,
				gold: 125,
				research: 135,
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
