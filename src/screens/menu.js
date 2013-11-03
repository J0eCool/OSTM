function ScreenDef(data) {
	this.name = data.name || '';
	this.displayName = data.displayName || data.name || '';
	this.html = data.html || '';
	this.createHtml = data.createHtml || function() {
		return this.html;
	};
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

	this.setScreen = function(name) {
		j('.' + this.classBase).hide();
		j('.' + name).show();
		this.onScreenSet(name);
		this.curScreen = name;
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
			html: '<div class="recipes"></div>'
		}),
		new ScreenDef({
			name: 'blacksmith',
			displayName: 'Blacksmith'
		}),
		new ScreenDef({
			name: 'village',
			displayName: 'Village'
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
		j('.header-container').html(headerHtml);

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

		j('#store-button', 'toggle', AdventureScreen.hasBeat('adv0'));
	},

	onScreenSet: function(name) {
		j('#' + this.curScreen + '-button').toggleClass('selected', false);
		j('#' + name + '-button').toggleClass('selected', true);
	}
});
