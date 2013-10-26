$(document).ready(function() {
	Game.windowSize = { width: $(window).width(), height: $(window).height() };

	$('.particles').html(ParticleContainer.getHtml());

	Game.init();

	window.setInterval(function() {
		Player.update();
		Forge.update();
	}, Game.normalDt);

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
	realtimeDt: 33,
	normalDt: 100,

	windowSize: null,

	data: null,

	init: function() {
		//this.data = JSON.parse()
		//$.getJSON('data.json').done(function() {
		//	console.log('ucsess');
			//Game.data = data;
			//console.log(data);
		//});

		Menu.init();
		EnemyManager.init();
		Player.init();

		Inventory.init();
		Forge.init();
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
