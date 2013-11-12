$(document).ready(function() {
	$('.particles').html(ParticleContainer.getHtml());

	Game.init();

	//TODO: create helper class that 1: adds these events , 2: creates size-x css as needed
	/*$('.health-button').click(function() {
		Player.healthPlusClicked();
	}).mouseleave(function() { $(this).attr('class', 'health-button'); })
	.mouseup(function() { $(this).attr('class', 'health-button size-1_1'); })
	.mouseenter(function() { $(this).attr('class', 'health-button size-1_1'); })
	.mousedown(function() { $(this).attr('class', 'health-button size-0_85'); });*/
});

Game = {
	toSave: ['Player', 'Inventory', 'AdventureScreen', 'Save', 'Village', 'Blacksmith'],

	realtimeDt: 33,
	normalDt: 100,

	init: function() {
		Log.init();

		Menu.init();
		EnemyManager.init();

		Inventory.init();
		Village.init();
		Blacksmith.init();

		Player.init();

		Save.load();

		window.setInterval(Game.update, Game.normalDt);
		Game.update();
	},

	update: function() {
		Player.update();
		Inventory.update();
		Village.update();
		Blacksmith.update();

		Menu.update();
		AdventureScreen.update();

		Save.update();
	}
};
