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
			getButtonHtml('Save.clearSave()', 'Delete Save', 'del-save') +
			'<br/><span id="save-info">' + getButtonHtml('Save.load()', 'Load') +
			'<br/>Saved hash: <span id="save-val"></span>' +
			'<br/>Current prehash value: <span id="save-prehash"></span></span>');
		window.setInterval(function() {
			$('#del-save,#save-info').toggle(Save.saveExists());
			$('#save-val').text(localStorage.saveString);
			$('#save-prehash').text(Save.getPreHashSaveString());
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
