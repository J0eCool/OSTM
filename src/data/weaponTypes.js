function loadWeaponTypes() {
	var types = {
		'dagger': new WeaponTypeDef({
			displayName: 'Dagger',
			upgradeData: {
				crit: 7,
				critDamage: 4,
			}
		}),
		'sword': new WeaponTypeDef({
			displayName: 'Sword',
			upgradeData: {
				damage: 5,
				crit: 6,
			}
		}),
		'sword2h': new WeaponTypeDef({
			displayName: 'Greatsword',
			upgradeData: {
				damage: 4,
				maxHealth: 2,
				defense: 3,
			}
		}),
		'axe': new WeaponTypeDef({
			displayName: 'Axe',
			upgradeData: {
				damage: 6,
				critDamage: 3,
			}
		}),
		'wand': new WeaponTypeDef({
			displayName: 'Wand',
			upgradeData: {
				spellPower: 3,
				manaRegen: 6,
			}
		}),
		'staff': new WeaponTypeDef({
			displayName: 'Staff',
			upgradeData: {
				spellPower: 6,
				maxMana: 3,
			}
		}),
		'mace': new WeaponTypeDef({
			displayName: 'Mace',
			upgradeData: {
				damage: 3,
				spellPower: 3,
				healthRegen: 3,
			}
		}),
	};

	foreach (types, function(type, key) {
		type.name = key;
	});
	return types;
}