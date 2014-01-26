function loadWeaponTypes() {
	var types = {
		'dagger': new WeaponTypeDef({
			displayName: 'Dagger',
		}),
		'sword': new WeaponTypeDef({
			displayName: 'Sword',
		}),
		'2hsword': new WeaponTypeDef({
			displayName: 'Greatsword',
		}),
		'axe': new WeaponTypeDef({
			displayName: 'Axe',
		}),
		'wand': new WeaponTypeDef({
			displayName: 'Wand',
		}),
		'staff': new WeaponTypeDef({
			displayName: 'Staff',
		}),
		'mace': new WeaponTypeDef({
			displayName: 'Mace',
		}),
	};

	foreach (types, function(type, key) {
		type.name = key;
	});
	return types;
}