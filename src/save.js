Save = {
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
		if (baseObject === null || saveObject === null) {
			return;
		}

		var save = baseObject.toSave || Object.keys(baseObject);
		for (var key in saveObject) {
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
	},

	getFullSaveObject: function() {
		var obj = {};
		for (var i = 0; i < Game.toSave.length; i++) {
			var str = Game.toSave[i];
			obj[str] = this.getSaveObject(eval(str));
		}
		return obj;
	},
	getPreHashSaveString: function() {
		return JSON.stringify(this.getFullSaveObject(), null, 2);
	},

	getSaveString: function() {
		return LZString.compressToBase64(this.getPreHashSaveString());
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
		var str = LZString.decompressFromBase64(localStorage.saveString);
		var restoredObject = JSON.parse(str);
		for (var i = 0; i < Game.toSave.length; i++) {
			var s = Game.toSave[i];
			this.restoreFromSaveObject(eval(s), restoredObject[s]);
		}
	}
};
