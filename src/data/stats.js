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
			minLevel: 24,
			baseValue: 40,
			levelValue: 7,

			onUpgrade: function() {
				Player.regenMana(this.upgradeValue());
			}
		}),
		'strength': new StatType({
			displayName: 'Strength',
			abbrev: 'STR',
			minLevel: 2,
			baseValue: 4
		}),
		'dexterity': new StatType({
			displayName: 'Dexterity',
			abbrev: 'DEX',
			minLevel: 10,
			baseValue: 5
		}),
		'intelligence': new StatType({
			displayName: 'Intelligence',
			abbrev: 'INT',
			minLevel: 24,
			baseValue: 3
		}),
		'defense': new StatType({
			displayName: 'Defense',
			abbrev: 'DEF',
			minLevel: 5,
			baseValue: 3
		})
	};
	for (var key in stats) {
		stats[key].name = key;
	}
	return stats;
}
