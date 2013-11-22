function ScreenDef(data) {
	this.name = data.name || '';
	this.displayName = data.displayName || data.name || '';
	this.html = data.html || '';
	this.createHtml = data.createHtml || function() {
		return this.html;
	};
	this.adventuresBlock = data.adventuresBlock || false;
	this.prereqs = data.prereqs || null;
}

function ScreenContainer(data) {
	this.screens = data.screens || [];
	this.classBase = data.classBase || 'screen';
	this.targetDiv = data.targetDiv || '.main-area';

	this.curScreen = '';

	this.init = function() {
		this.preInit();

		var html = '';
		for (var i = 0; i < this.screens.length; i++) {
			var scr = this.screens[i];
			html += '<div class="' + this.classBase + ' ' + scr.name + '">' +
				scr.createHtml() + '</div>';
		}
		$(this.targetDiv).html(html);
		this.postInit();

		if (this.screens.length > 0) {
			this.setScreen(this.screens[0].name);
		}
	};

	this.preInit = data.preInit || function(){};
	this.postInit = data.postInit || function(){};

	this.update = data.update || function(){};

	this.getScreen = function(name) {
		for (var i = 0; i < this.screens.length; i++) {
			var screen = this.screens[i];
			if (screen.name === name) {
				return screen;
			}
		}

		return null;
	};

	this.setScreen = function(name) {
		if (!j('#' + name + '-button').hasClass('inactive')) {
			j('.' + this.classBase).hide();
			j('.' + name).show();
			this.onScreenSet(name);
			this.curScreen = name;
		}
	};

	this.onScreenSet = data.onScreenSet || function(name){};

	this.isOpen = function(name) {
		return this.curScreen == name;
	};
}

Menu = new ScreenContainer({
	screens: [
		new ScreenDef({
			name: 'adventure',
			displayName: 'Adventure'
		}),
		new ScreenDef({
			name: 'store',
			displayName: 'Store',
			html: '<div class="recipes"></div>',
			adventuresBlock: true,
			prereqs: {
				adventures: ['adv0']
			}
		}),
		new ScreenDef({
			name: 'blacksmith',
			displayName: 'Blacksmith',
			prereqs: {
				buildings: {
					'blacksmith': 1
				}
			}
		}),
		new ScreenDef({
			name: 'village',
			displayName: 'Village',
			prereqs: {
				adventures: ['adv1']
			}
		}),
		new ScreenDef({
			name: 'skills',
			displayName: 'Skills',
			prereqs: {
				buildings: {
					'training-hall': 1
				}
			}
		}),
		new ScreenDef({
			name: 'options',
			displayName: 'Options',
			html: getButtonHtml('Save.save()', 'Save') + ' ' +
				getButtonHtml('Save.autosave = !Save.autosave',
					'Autosave: <span id="save-autosave"></span>') +
				'<span id="save-info"><br/>' +
				getButtonHtml('Save.clearSave()', 'Delete Save', 'del-save') +
				'<br/>Export hash: <textarea disabled id="save-val"></textarea></span><br/>' +
				getButtonHtml("Save.import($('#save-import').val())", 'Import') +
				'Import hash: <textarea id="save-import"></textarea>'
		})
	],

	classBase: 'screen',
	targetDiv: '.main-area',

	postInit: function() {
		var headerHtml = '';
		foreach (this.screens, function (scr) {
			headerHtml += getButtonHtml("Menu.setScreen('" + scr.name + "')",
				scr.displayName, scr.name + '-button') + ' ';
		});
		j('.header-buttons', 'html', headerHtml);

		this.setScreen('adventure');

		AdventureScreen.init();
	},

	update: function() {
		j('#save-info', 'toggle', Save.saveExists());
		var saveVal = j('#save-val');
		if (saveVal.text() != Save.getSavedString()) {
			saveVal.text(Save.getSavedString());
		}
		j('#save-autosave', 'text', Save.autosave ? 'Enabled' : 'Disabled');

		foreach (this.screens, function(scr) {
			var id = '#' + scr.name + '-button';
			j(id, 'toggle', prereqsMet(scr.prereqs));
			j(id, 'toggleClass', 'inactive', scr.adventuresBlock && AdventureScreen.isAdventuring());
		});
	},

	onScreenSet: function(name) {
		j('#' + this.curScreen + '-button', 'toggleClass', 'selected', false);
		j('#' + name + '-button', 'toggleClass', 'selected', true);
	}
});
