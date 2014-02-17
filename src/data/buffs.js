function loadBuffs() {
	var buffs = {
		'xp': new BuffDef({
			displayName: 'XP Bonus',
			effects: {
				xpIncome: {
					base: 10,
					level: 1
				}
			}
		}),
		'gold': new BuffDef({
			displayName: 'Gold Bonus',
			effects: {
				goldIncome: {
					base: 10,
					level: 1
				}
			}
		}),
		'healthRegen': new BuffDef({
			displayName: 'Health Bonus',
			effects: {
				healthRegen: {
					base: 5,
					level: 0.5
				}
			}
		}),
		'manaRegen': new BuffDef({
			displayName: 'Mana Bonus',
			effects: {
				manaRegen: {
					base: 5,
					level: 0.5
				}
			}
		}),
		'damage': new BuffDef({
			displayName: 'Damage Bonus',
			effects: {
				damage: {
					base: 5,
					level: 0.5
				}
			}
		}),
	};

	foreach (buffs, function(buff, key) {
		buff.name = key;
	});

	return buffs;
}