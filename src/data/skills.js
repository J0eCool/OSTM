function loadSkills() {
	var skills = {
		'attack': new AttackSkillDef({
			displayName: 'Attack',
			keyCode: 'a',
			baseDamage: 100,
			levelDamage: 5,
			level: 1
		}),
		'power-attack': new AttackSkillDef({
			displayName: 'Power Attack',
			keyCode: '1',
			manaCost: 6,
			baseDamage: 200,
			levelDamage: 40
		}),
		'quick-attack': new AttackSkillDef({
			displayName: 'Quick Attack',
			keyCode: '2',
			description: '2x chance to critically strike',
			bonuses: {
				crit: 100
			},
			manaCost: 7,
			baseDamage: 120,
			levelDamage: 15
		}),
		'whirlwind': new AttackSkillDef({
			displayName: 'Whirlwind',
			keyCode: '3',
			description: 'Hits all enemies on screen',
			manaCost: 15,
			baseDamage: 80,
			levelDamage: 10,

			doAttack: function(enemy) {
				for (var i = EnemyManager.activeEnemies.length - 1; i >= 0; i--) {
					var e = EnemyManager.activeEnemies[i];
					e.takeDamage(Player.getDamageInfo());
				}
			}
		}),

		'magic-missile': new SpellSkillDef({
			displayName: 'Magic Missile',
			keyCode: '4',
			manaCost: 8,
			baseDamage: 200,
			levelDamage: 50,
			baseCrit: 5,
		}),
		'fireBolt': new SpellSkillDef({
			keyCode: '5',
			displayName: 'Fire Bolt',
			manaCost: 18,
			baseDamage: 350,
			levelDamage: 75,
			baseCrit: 4,
		}),
		'lightningBolt': new SpellSkillDef({
			keyCode: '6',
			displayName: 'Lightning Bolt',
			description: '100% higher max damage',
			bonuses: {
				maxDamage: 100,
			},
			manaCost: 16,
			baseDamage: 200,
			levelDamage: 40,
			baseCrit: 6,
		}),
		'fireball': new SpellSkillDef({
			displayName: 'Fireball',
			keyCode: '7',
			description: 'Hits all enemies on screen, enemies closer to target take more damage',
			manaCost: 36,
			baseDamage: 140,
			levelDamage: 18,
			baseCrit: 3,
			doAttack: function(enemy) {
				var pos = enemy.getAbsolutePosition();
				var siz = 250;
				var jit = 32;
				var rangeLo = 0.2;
				var rangeHi = 0.6;
				var dmgHi = 0.85;
				var dmgLo = 0.35;
				ParticleContainer.createEffect('Explosion.png', {
					x: pos.x + (pos.w - siz) / 2 + randIntInc(-jit, jit),
					y: pos.y + (pos.h - siz) / 2 + randIntInc(-jit, jit),
					w: siz,
					h: siz,
				});

				enemy.takeDamage(Player.getDamageInfo());
				for (var i = EnemyManager.activeEnemies.length - 1; i >= 0; i--) {
					var e = EnemyManager.activeEnemies[i];
					if (e != enemy) {
						var d = distance(enemy.x, enemy.y, e.x, e.y);
						var dmg = lerp((d - rangeLo) / (rangeHi - rangeLo), dmgHi, dmgLo);
						e.takeDamage(Player.getDamageInfo(dmg));
					}
				}
			}
		}),
		'chainLightning': new SpellSkillDef({
			displayName: 'Chain Lightning',
			keyCode: '8',
			description: 'Hits all enemies on screen, does 20% less damage with each bounce',
			manaCost: 28,
			baseDamage: 150,
			levelDamage: 20,
			baseCrit: 7,
			doAttack: function() {
				var w = 50;
				var stepMult = 0.8;

				var makeArc = function(from, to) {
					var jit = 16;
					var fPos = from.getAbsolutePosition();
					var tPos = to.getAbsolutePosition();
					fPos.x += fPos.w / 2 + randIntInc(-jit, jit);
					fPos.y += fPos.h / 2 + randIntInc(-jit, jit);
					tPos.x += tPos.w / 2 + randIntInc(-jit, jit);
					tPos.y += tPos.h / 2 + randIntInc(-jit, jit);

					var d = vecDistance(fPos, tPos);

					ParticleContainer.createEffect('Lightning.png', {
						x: (fPos.x + tPos.x - w) / 2,
						y: (fPos.y + tPos.y - d) / 2,
						w: w,
						h: d,
						deg: 90 + 180 / Math.PI * Math.atan2(tPos.y - fPos.y, tPos.x - fPos.x),
						fadeTime: 250
					});
				};

				var damage = function(e, hitSet, dmg) {
					var closest = null;
					var minDist = 0;
					foreach (EnemyManager.activeEnemies, function(en) {
						if (hitSet.indexOf(en) === -1) {
							var d = distance(e.x, e.y, en.x, en.y);
							if (!closest || d < minDist) {
								closest = en;
								minDist = d;
							}
						}
					});

					if (closest) {
						makeArc(e, closest);
						damage(closest, hitSet.concat(closest), dmg * stepMult);
					}

					e.takeDamage(Player.getDamageInfo(dmg));
				};

				return function(enemy) {
					damage(enemy, [enemy], 1);
				};
			}()
		}),



		'health-up': new PassiveSkillDef({
			displayName: 'Health Plus',
			description: 'Increases Max Health by <mult.maxHealth>%',
			statMult: {
				maxHealth: {
					base: 10,
					level: 5
				}
			}
		}),
		'health-scale': new PassiveSkillDef({
			displayName: 'Health Mastery',
			description: 'Increases Max Health by <mult.healthPerLevel>% per Player Level',
			statMult: {
				healthPerLevel: {
					base: 0.025,
					level: 0.005
				}
			}
		}),
		'fortitude': new PassiveSkillDef({
			displayName: 'Fortitude',
			description: 'Increases overall Health Regen by <mult.healthRegen>%',
			statMult: {
				healthRegen: {
					base: 20,
					level: 5
				}
			}
		}),
		'heartiness': new PassiveSkillDef({
			displayName: 'Heartiness',
			description: 'Restores Health by <base.healthRegen>% of Max Health every second',
			statBase: {
				healthRegen: {
					base: 1,
					level: 0.1
				}
			}
		}),
		'mana-up': new PassiveSkillDef({
			displayName: 'Mana Plus',
			description: 'Increases Max Mana by <mult.maxMana>%',
			statMult: {
				maxMana: {
					base: 12,
					level: 6
				}
			}
		}),
		'focus': new PassiveSkillDef({
			displayName: 'Focus',
			description: 'Increases overall Mana Regen by <mult.manaRegen>%',
			statMult: {
				manaRegen: {
					base: 25,
					level: 6
				}
			}
		}),
		'crystal-mind': new PassiveSkillDef({
			displayName: 'Crystal Mind',
			description: 'Restores Mana by <base.manaRegen>% of Max Mana every second',
			statBase: {
				manaRegen: {
					base: 1.5,
					level: 0.15
				}
			}
		}),
		'spellSword': new PassiveSkillDef({
			displayName: 'Spell Sword',
			description: 'Restores <base.attackMana> MP with every standard Attack',
			statBase: {
				attackMana: {
					base: 3,
					level: 2
				}
			}
		}),
		'precision': new PassiveSkillDef({
			displayName: 'Precision',
			description: 'Increase base Crit Chance by <base.crit>%',
			statBase: {
				crit: {
					base: 0.5,
					level: 0.075
				}
			}
		}),
		'ruthlessness': new PassiveSkillDef({
			displayName: 'Ruthlessness',
			description: 'Increase overall Crit Chance by <mult.crit>%',
			statMult: {
				crit: {
					base: 6,
					level: 1.25
				}
			}
		}),
		'cruelty': new PassiveSkillDef({
			displayName: 'Cruelty',
			description: 'Adds <base.critDamage>% Crit Damage and increases Physical Damage by <mult.damage>%',
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
			description: 'Increases Physical and Spell Damage by <mult.damage>%',
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
		'alchemy': new PassiveSkillDef({
			displayName: 'Alchemy',
			description: 'Increases item effectiveness by <mult.itemEffeciency>%',
			statMult: {
				itemEffeciency: {
					base: 100,
					level: 25
				}
			}
		}),
	};

	foreach (skills, function(skill, key) {
		skill.name = key;
	});
	return skills;
}
