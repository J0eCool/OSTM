Menu = {
	screens: ['adventure', 'options'],

	curScreen: '',

	init: function() {
		var mainHtml = '';
		var headerHtml = '';
		for (var i = 0; i < this.screens.length; i++) {
			var name = this.screens[i];
			mainHtml += '<div class="screen ' + name + '"></div>';
			headerHtml += getButtonHtml('Menu.setScreen(\'' + name + '\')', name, name + '-button') + ' ';
		}
		$('.main-area').html(mainHtml);
		$('.header-container').html(headerHtml);

		this.setScreen('adventure');

		AdventureScreen.init();

		$('.options').html(getButtonHtml('Save.save()', 'Save') + ' ' +
			'<span id="save-info"><br/>' +
			getButtonHtml('Save.clearSave()', 'Delete Save', 'del-save') +
			'<br/>Export hash: <input type="text" id="save-val"></input></span><br/>' +
			getButtonHtml("Save.import($('#save-import').val())", 'Import') +
			'Import hash: <input type="text" id="save-import"></input>');
		window.setInterval(function() {
			$('#save-info').toggle(Save.saveExists());
			$('#save-val').attr('value', Save.getSaveString());
		}, 500);
	},

	setScreen: function(name) {
		$('.screen').hide();
		$('.' + name).show();
		this.curScreen = name;
	},

	isOpen: function(name) {
		return this.curScreen == name;
	}
};
