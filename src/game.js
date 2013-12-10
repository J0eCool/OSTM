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

var Game = {
	toSave: ['Player', 'Inventory', 'AdventureScreen', 'Save',
		'Village', 'Blacksmith', 'Skills', 'Options'],

	realtimeDt: 33,
	normalDt: 100,
	veryLongDt: 30000,

	dT: 100,

	mouse: {
		x: 0,
		y: 0
	},

	init: function() {
		Log.init();

		Menu.init();
		EnemyManager.init();

		Inventory.init();
		Village.init();
		Blacksmith.init();
		Skills.init();

		Player.init();

		Save.load();

		window.setInterval(Game.update, Game.normalDt);
		window.setInterval(Game.realtimeUpdate, Game.realtimeDt);
		window.setInterval(Game.veryLongUpdate, Game.veryLongDt);
		Game.update();

		$(window).resize(function() {
			Game.handleResize();
		});

		$(document).keypress(function(event) {
			Game.keyPressed(String.fromCharCode(event.which).toLowerCase());
		}).on('mousemove', function(event) {
			Game.mouseMoved(event.pageX, event.pageY);
		});

		// Report current version
		ga('set', 'dimension1', Save.currentSaveVersion);
	},

	update: function() {
		var prevTime = Date.now();
		return function() {
			Game.dT = (Date.now() - prevTime) / 1000;

			Player.update();
			Inventory.update();
			Village.update();
			Blacksmith.update();
			Skills.update();

			EnemyManager.update();

			Menu.update();
			AdventureScreen.update();

			Save.update();

			prevTime = Date.now();
		};
	}(),

	realtimeUpdate: function() {
		TimerManager.update();
	},

	veryLongUpdate: function() {
		// Check for updates
		$.getJSON('update.json', function(data) {
			if (data && data.version && Save.isNewerVersion(data.version, Save.currentSaveVersion)) {
				var str = '<h4>New Update! (refresh to get it) - ' + data.version + '</h4><i>' +
					data.description + '</i><ul>';
				for (var i = 0; i < data.changes.length; i++) {
					str += '<li>' + data.changes[i] + '</li>';
				}
				str += '</ul>';
				j('.update', 'toggle', true);
				j('.update', 'html', str);
			}
		});

		// Report player level
		ga('set', 'dimension2', Player.getLevel());
	},

	handleResize: function() {
		// var win = $(window);
		var windowSize = {
			// width: win.width(),
			// height: win.height()
		};
		foreach (EnemyManager.activeEnemies, function(enemy) {
			 enemy.handleResize(windowSize);
		});
	},

	keyPressed: function(key) {
		Skills.keyPressed(key);
	},

	mouseMoved: function(xPos, yPos) {
		this.mouse = {
			x: xPos,
			y: yPos
		};
	},
};
