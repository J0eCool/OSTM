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
			manaCost: 12,
			baseDamage: 150,
			levelDamage: 25
		}),
		'quick-attack': new AttackSkillDef({
			displayName: 'Quick Attack',
			scalingBase: {
				dexterity: 2.5
			},
			manaCost: 12,
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
