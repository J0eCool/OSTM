function loadBuffs() {
	var buffs = {
		'xp': new BuffDef({
			displayName: 'XP Bonus',
			effects: {
				'xp-income': {
					base: 10,
					level: 1
				}
			}
		}),
		'gold': new BuffDef({
			displayName: 'Gold Bonus',
			effects: {
				'gold-income': {
					base: 10,
					level: 1
				}
			}
		}),
	};

	foreach (buffs, function(buff, key) {
		buff.name = key;
	});

	return buffs;
}