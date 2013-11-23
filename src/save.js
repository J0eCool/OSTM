Save = {
	toSave: ['autosave'],

	currentSaveVersion: '/* @echo version */',

	autosave: true,
	autoDt: 30000,
	autoTimer: 0,

	update: function() {
		if (this.autosave) {
			this.autoTimer += Game.normalDt;
			if (this.autoTimer >= this.autoDt) {
				this.autoTimer -= this.autoDt;
				this.save();
			}
		}
	},

	getSaveObject: function(baseObject) {
		if (baseObject === null) {
			return null;
		}

		var save = baseObject.toSave || Object.keys(baseObject);
		var saveObject = {};

		for (var key in baseObject) {
			if (save[key] || !save.indexOf || save.indexOf(key) >= 0) {
				if (typeof(baseObject[key]) === 'object') {
					saveObject[key] = this.getSaveObject(baseObject[key]);
				}
				else {
					saveObject[key] = baseObject[key];
				}
			}
		}

		return saveObject;
	},

	restoreFromSaveObject: function(baseObject, saveObject) {
		if (!baseObject || !saveObject) {
			return;
		}

		var save = baseObject.toSave || Object.keys(baseObject);
		for (var key in saveObject) {
			//console.log('restoring ' + key);
			if (save[key] || !save.indexOf || save.indexOf(key) >= 0) {
				if (typeof(baseObject[key]) === 'object') {
					this.restoreFromSaveObject(baseObject[key], saveObject[key]);
				}
				else {
					baseObject[key] = saveObject[key];
				}
			}
		}
	},

	save: function() {
		localStorage.saveString = this.getSaveString();
		Log.write('Game Saved');
	},

	getFullSaveObject: function() {
		var obj = {
			saveVersion: this.currentSaveVersion
		};
		for (var i = 0; i < Game.toSave.length; i++) {
			var key = Game.toSave[i];
			obj[key] = this.getSaveObject(eval(key));
		}
		return obj;
	},
	getPreHashSaveString: function() {
		return JSON.stringify(this.getFullSaveObject());
	},

	getSaveString: function() {
		return LZString.compressToBase64(this.getPreHashSaveString());
	},

	getSavedString: function() {
		return localStorage.saveString;
	},

	saveExists: function() {
		if (localStorage.saveString) {
			return true;
		}
		return false;
	},

	clearSave: function() {
		delete localStorage.saveString;
	},

	load: function() {
		if (localStorage.saveString) {
			Save.import(localStorage.saveString);
		}
	},

	import: function(str) {
		if (str && str !== '') {
			//console.log('importing: ' + str);
			var baseStr = LZString.decompressFromBase64(str);
			try {
				//console.log('  base str: ' + baseStr);
				if (baseStr === null || baseStr === '') {
					throw('Load failed! Invalid import string');
				}

				var restoredObject = JSON.parse(baseStr);
				if (restoredObject.saveVersion > this.currentSaveVersion) {
					throw('Load failed! Saved version is greater than current version. Old version is: ' + restoredObject.saveVersion);
				}
				//console.log('  object : ' + restoredObject);
				for (var i = 0; i < Game.toSave.length; i++) {
					var key = Game.toSave[i];
					var obj = eval(key);
					this.restoreFromSaveObject(obj, restoredObject[key]);
					if (obj.postLoad) {
						obj.postLoad();
					}
				}
			}
			catch (exception) {
				if (typeof exception === 'string') {
					alert(exception);
				}
				else {
					alert('Load failed! Unparseable save data');
				}

				this.autosave = false;
			}
		}
	}
};
