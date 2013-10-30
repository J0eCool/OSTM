$(document).ready(function() {
	Game.windowSize = { width: $(window).width(), height: $(window).height() };

	$('.particles').html(ParticleContainer.getHtml());

	Game.init();

	//TODO: create helper class that 1: adds these events , 2: creates size-x css as needed
	/*$('.health-button').click(function() {
		Player.healthPlusClicked();
	}).mouseleave(function() { $(this).attr('class', 'health-button'); })
	.mouseup(function() { $(this).attr('class', 'health-button size-1_1'); })
	.mouseenter(function() { $(this).attr('class', 'health-button size-1_1'); })
	.mousedown(function() { $(this).attr('class', 'health-button size-0_85'); });*/

	$(window).resize(Game.handleResize);
});

Game = {
	toSave: ['Player', 'Inventory', 'AdventureScreen', 'Save'],

	realtimeDt: 33,
	normalDt: 100,

	windowSize: null,

	init: function() {
		Menu.init();
		EnemyManager.init();
		Player.init();

		Inventory.init();

		Save.load();

		window.setInterval(Game.update, Game.normalDt);
	},

	update: function() {
		Player.update();
		Inventory.update();
		Forge.update();
		AdventureScreen.update();

		Save.update();
	},

	handleResize: function() {
		var windowSize = {
			width: Math.max($(window).width(), 500),
			height: Math.max($(window).height(), 500)
		};

		for (var i = 0; i < EnemyManager.enemies.length; i++) {
			EnemyManager.enemies[i].handleResize(windowSize);
		}

		Game.windowSize = windowSize;
	}
};
