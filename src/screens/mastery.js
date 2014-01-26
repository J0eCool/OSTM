var Mastery = {
	toSave: ['weaponTypes'],

	weaponTypes: {},

	init: function() {
		this.weaponTypes = loadWeaponTypes();
	}
};

function WeaponTypeDef(data) {
	this.toSave = ['xp', 'level'];

	this.name = data.name || '';
	this.displayName = data.displayName || '';

	this.level = 0;
	this.xp = 0;
}
