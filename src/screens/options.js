var Options = {
	toSave: ['fancyGraphics', 'resetToAttack', 'showRewards'],

	fancyGraphics: true,
	resetToAttack: false,

	showRewards: {},

	init: function() {
		foreach (Player.resources, function(r) {
			Options.showRewards[r] = true;
		});

		var str = '<div>' + getButtonHtml('Save.save()', 'Save') + ' ' +
			getButtonHtml('Save.autosave = !Save.autosave',
				'Autosave: <span id="save-autosave"></span>') + '</div>' +
			'<div id="save-info">' +
			getButtonHtml('Save.clearSave()', 'Delete Save', 'del-save') +
			'<div>Export hash: <div class="saveArea" id="save-val"></div></div></div>' +
			'<div>' + getButtonHtml("Save.import($('#save-import').val())", 'Import') +
			'Import hash: <textarea class="saveArea" id="save-import"></textarea></div>' +
			'<div><ul><li>Fancy Graphics: <input type="checkbox" id="fancy-graphics"></input></li>' +
			'<li>Reset to Attack when out of Mana: <input type="checkbox" id="attack-reset"></input></li></ul></div>' +
			'<div>Show Rewards: <ul id="reward-options">';
		foreach (this.showRewards, function(show, name) {
			str += '<li id="' + name + '">' + getIconHtml(name) + '<input type="checkbox" id="show"></input></li>';
		});
		str += '</ul></div>';

		j('.options', 'html', str);

		this.postLoad();
	},

	postLoad: function() {
		j('#fancy-graphics').prop('checked', this.fancyGraphics);
		j('#attack-reset').prop('checked', this.resetToAttack);

		foreach (this.showRewards, function(show, name) {
			j('#reward-options #' + name + ' #show').prop('checked', show);
		});
	},

	update: function() {
		j('#save-info', 'toggle', Save.saveExists());
		j('#save-val', 'text', Save.getSavedString());
		j('#save-autosave', 'text', Save.autosave ? 'Enabled' : 'Disabled');

		this.fancyGraphics = j('#fancy-graphics').prop('checked');
		this.resetToAttack = j('#attack-reset').prop('checked');

		foreach (this.showRewards, function(show, name) {
			var id = '#reward-options #' + name;
			j(id, 'toggle', Player[name].unlocked);
			Options.showRewards[name] = j(id + ' #show').prop('checked');
		});
	}
};