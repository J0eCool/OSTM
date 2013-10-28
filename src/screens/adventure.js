AdventureScreen = new ScreenContainer({
	classBase: 'adventure-screen',
	targetDiv: '.adventure',

	screens: [
		new ScreenDef({
			name: 'field'
		}),
		new ScreenDef({
			name: 'map-select',
			html: getButtonHtml("AdventureScreen.setScreen('store')", "Store") +
				'<br>' + getButtonHtml("AdventureScreen.setScreen('field')", "Field")
		}),
		new ScreenDef({
			name: 'store',
			html: getButtonHtml("AdventureScreen.setScreen('map-select')", 'Leave') +
				'<div class="recipes"></div>'
		})
	],

	onScreenSet: function(name) {
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
	}
});