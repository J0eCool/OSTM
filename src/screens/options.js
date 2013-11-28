var Options = {
	toSave: ['fancyGraphics', 'resetToAttack'],

	fancyGraphics: true,
	resetToAttack: false,

	init: function() {
		var str = getButtonHtml('Save.save()', 'Save') + ' ' +
			getButtonHtml('Save.autosave = !Save.autosave',
				'Autosave: <span id="save-autosave"></span>') +
			'<span id="save-info"><br>' +
			getButtonHtml('Save.clearSave()', 'Delete Save', 'del-save') + '<br>' +
			getButtonHtml("Save.import($('#save-import').val())", 'Import') +
			'Import hash: <textarea class="saveArea" id="save-import"></textarea>' +
			'<br>Export hash: <div class="saveArea" id="save-val"></div></span><br><br>' +
			'<ul><li>Fancy Graphics: <input type="checkbox" id="fancy-graphics"></input></li>' +
			'<li>Reset to Attack when out of Mana: <input type="checkbox" id="attack-reset"></input></li></ul>';
		j('.options', 'html', str);

		this.postLoad();
	},

	postLoad: function() {
		j('#fancy-graphics').prop('checked', this.fancyGraphics);
		j('#attack-reset').prop('checked', this.resetToAttack);
	},

	update: function() {
		j('#save-info', 'toggle', Save.saveExists());
		j('#save-val', 'text', Save.getSavedString());
		j('#save-autosave', 'text', Save.autosave ? 'Enabled' : 'Disabled');

		this.fancyGraphics = j('#fancy-graphics').prop('checked');
		this.resetToAttack = j('#attack-reset').prop('checked');
	}
};