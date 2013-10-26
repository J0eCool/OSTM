AdventureScreen = {

	subscreens: ['field', 'store'],
	curScreen: '',

	init: function() {
		var html = '';
		for (var i = 0; i < this.subscreens.length; i++) {
			html += '<div class="adventure-screen ' + this.subscreens[i] + '"></div>';
		}

		$('.adventure').html(html);

		$('.store').html('You can buy stuff now ;)<br/>' +
			getButtonHtml('AdventureScreen.setScreen(\'field\')', 'Leave'));

		this.setScreen('field');
	},

	setScreen: function(name) {
		$('.adventure-screen').hide();
		$('.' + name).show();

		if (!this.isOpen('field') && name == 'field') {
			EnemyManager.maxLevelUnlocked = 1;
			EnemyManager.level = 1;
			EnemyManager.spawnEnemies();
			EnemyManager.updateUI();
		}
		else {
			Player.health = Player.maxHealth.value();
		}

		this.curScreen = name;
	},


	isOpen: function(name) {
		return this.curScreen == name;
	}
};