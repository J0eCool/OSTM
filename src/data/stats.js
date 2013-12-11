function loadStats() {
	var stats = {
		'maxHealth': new StatType({
			displayName: 'Vitality',
			description: 'Increase health by <bonus> per level (<totalBonus> total)',
			baseValue: 5,
			bonus: 20,

			onUpgrade: function() {
				//technically not correct but it rounds up and is close
				Player.regenHealth(this.upgradeValue());
			}
		}),
		'maxMana': new StatType({
			displayName: 'Spirit',
			description: 'Increase mana by <bonus> per level (<totalBonus> total)',
			baseValue: 5,
			bonus: 7,
			prereqs: {
				buildings: {
					'training-hall': 1
				}
			},

			onUpgrade: function() {
				Player.regenMana(this.upgradeValue());
			}
		}),
		'strength': new StatType({
			displayName: 'Strength',
			abbrev: 'STR',
			description: 'Increases Attack Power by <bonus>% per level (+<totalBonus>% total)',
			baseValue: 4,
			bonus: 0.5,
			prereqs: {
				playerLevel: 2
			},
		}),
		'dexterity': new StatType({
			displayName: 'Dexterity',
			abbrev: 'DEX',
			description: 'Increases Crit Damage by <bonus>% per level (+<totalBonus>% total)',
			baseValue: 5,
			bonus: 1,
			prereqs: {
				buildings: {
					'blacksmith': 1
				}
			},
		}),
		'intelligence': new StatType({
			displayName: 'Intelligence',
			abbrev: 'INT',
			description: 'Increases Spell Power by <bonus>% per level (+<totalBonus>% total)',
			baseValue: 3,
			bonus: 0.5,
			prereqs: {
				buildings: {
					'wizard-tower': 1
				}
			},
		}),
		'wisdom': new StatType({
			displayName: 'Wisdom',
			abbrev: 'WIS',
			description: 'Increases mana regen by <bonus>/s per level (+<totalBonus> total)',
			baseValue: 3,
			bonus: 0.5,
			prereqs: {
				buildings: {
					'wizard-tower': 1
				}
			},
		}),
		'defense': new StatType({
			displayName: 'Defense',
			abbrev: 'DEF',
			description: 'Increases health regen by <bonus>/s per level (+<totalBonus> total)',
			baseValue: 3,
			bonus: 0.25,
			prereqs: {
				adventures: ['adv0']
			},
		})
	};
	for (var key in stats) {
		stats[key].name = key;
	}
	return stats;
}
