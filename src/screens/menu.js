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

		$('.options').html(getButtonHtml('Game.save()', 'Save') + ' ' +
			getButtonHtml('Game.clearSave()', 'Delete Save', 'del-save') +
			'<br/><span id="save-info">Saving actually does nothing yet :P<br/>"Save" value: <span id="save-val"></span></span>');
		window.setInterval(function() {
			$('#del-save,#save-info').toggle(Game.saveExists());
			$('#save-val').text(localStorage.saveString);
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
