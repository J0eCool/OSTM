Menu = {
	screens: ['adventure', 'options'],

	curScreen: '',

	init: function() {
		var mainHtml = '';
		for (var i = 0; i < this.screens.length; i++) {
			mainHtml += '<div class="screen ' + this.screens[i] + '"></div>';
		}
		$('.main-area').html(mainHtml);

		var headerHtml = '';
		for (var i = 0; i < this.screens.length; i++) {
			var name = this.screens[i];
			headerHtml += getButtonHtml('Menu.setScreen(\'' + name + '\')', name, name + '-button') + ' ';
		}
		$('.header-container').html(headerHtml);

		this.setScreen('adventure');

		AdventureScreen.init();

		$('.options').html('There are no options :(');
	},

	setScreen: function(name) {
		$('.screen').hide();
		$('.' + name).show();
		this.curScreen = name;
	},

	isOpen: function(name) {
		return this.curScreen == name;
	}
}
