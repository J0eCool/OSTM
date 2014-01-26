var Mastery = {
	toSave: ['weaponTypes'],

	weaponTypes: {},

	init: function() {
		this.weaponTypes = loadWeaponTypes();
	}
};