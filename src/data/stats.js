function loadStats() {
	var stats = {
		'maxHealth': new StatType({
			displayName: 'Health',
			baseValue: 100,
			levelValue: 20,

			onUpgrade: function() {
				//technically not correct but it rounds up and is close
				Player.regenHealth(this.upgradeValue());
			}
		}),
		'maxMana': new StatType({
			displayName: 'Mana',
			baseValue: 40,
			levelValue: 7,
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
			baseValue: 4,
			bonusPercent: 0.5,
			prereqs: {
				playerLevel: 2
			},
		}),
		'dexterity': new StatType({
			displayName: 'Dexterity',
			abbrev: 'DEX',
			baseValue: 5,
			bonusPercent: 1,
			prereqs: {
				buildings: {
					'blacksmith': 1
				}
			},
		}),
		'intelligence': new StatType({
			displayName: 'Intelligence',
			abbrev: 'INT',
			baseValue: 3,
			bonusPercent: 0.5,
			prereqs: {
				buildings: {
					'wizard-tower': 1
				}
			},
		}),
		'defense': new StatType({
			displayName: 'Defense',
			abbrev: 'DEF',
			baseValue: 3,
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
