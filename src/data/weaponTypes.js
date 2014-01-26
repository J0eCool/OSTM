function loadWeaponTypes() {
	var types = {
		'dagger': 'Dagger',
		'sword': 'Sword',
		'2hsword': 'Greatsword',
		'axe': 'Axe',
		'wand': 'Wand',
		'staff': 'Staff',
		'mace': 'Mace',
	};

	foreach (types, function(type, key) {
		type.name = key;
	});
	return types;
}