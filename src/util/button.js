ButtonManager = function() {
	var buttons = [];

	var Button = function(data) {
		var hiddenId = buttons.length;
		buttons.push(this);

		var clickStr = '';

		this.onclick = data.onclick;
		if (this.onclick) {
			clickStr = ' onclick="ButtonManager.click(' + hiddenId + ')"';
		}

		this.id = data.id;
		var idStr = data.id ? ' id="' + data.id + '"' : '';
		var contents = data.contents;

		this.html = function() {
			return '<span class="button"' + clickStr + idStr + 
				'><span class="content">' + contents + '</span></span>';
		};
		this.update = data.update || null;
	};

	return {
		click: function(idNum) {
			buttons[idNum].onclick();
		},
		create: function(data) {
			return new Button(data);
		}
	};
}();