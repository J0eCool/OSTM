$(document).ready(function() {
	Game.windowSize = { width: $(window).width(), height: $(window).height() };

	$('.particles').html(ParticleContainer.getHtml());

	EnemyManager.setupEnemies();
	Player.init();
	Forge.init();

	window.setInterval(function() {
		Player.update();
	}, Game.normalDt);

	$('.health-button').click(function() {
		Player.healthPlusClicked();
	}).mouseleave(function() { $(this).attr('class', 'health-button'); })
	.mouseup(function() { $(this).attr('class', 'health-button size-1_1'); })
	.mouseenter(function() { $(this).attr('class', 'health-button size-1_1'); })
	.mousedown(function() { $(this).attr('class', 'health-button size-0_85'); });

	$(window).resize(Game.handleResize);
});

Game = {
	realtimeDt: 33,
	normalDt: 100,

	windowSize: null,

	handleResize: function() {
		var windowSize = {
			width: Math.max($(window).width(), 500),
			height: Math.max($(window).height(), 500)
		};

		for (var i = 0; i < EnemyManager.enemies.length; i++) {
			EnemyManager.enemies[i].handleResize(windowSize);
		};

		Game.windowSize = windowSize;
	}
};

function getIconHtml(type) {
	return '<img class="icon ' + type + '-icon" />';
};
