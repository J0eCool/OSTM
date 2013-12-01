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
			manaCost: 8,
			baseDamage: 150,
			levelDamage: 25
		}),
		'quick-attack': new AttackSkillDef({
			displayName: 'Quick Attack',
			scalingBase: {
				dexterity: 2.5
			},
			manaCost: 7,
			baseDamage: 140,
			levelDamage: 20
		}),

		'magic-missile': new SpellSkillDef({
			displayName: 'Magic Missile',
			scalingBase: {
				intelligence: 10
			},
			manaCost: 4,
			baseDamage: 80,
			levelDamage: 20
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
		'precision': new PassiveSkillDef({
			displayName: 'Precision',
			description: 'Increase weapon base Crit Chance by <base.crit>%',
			statBase: {
				crit: {
					base: 1,
					level: 0.1
				}
			}
		}),
		'cruelty': new PassiveSkillDef({
			displayName: 'Cruelty',
			description: 'Adds <base.critDamage>% Crit Damage and increases all Damage by <mult.damage>%',
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
			description: 'Increases Damage and Spell Power by <mult.damage>%',
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
