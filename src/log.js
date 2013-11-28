var Log = {
	maxLines: 5,

	inUse: {},
	lastSet: 0,

	init: function() {
		var html = '';
		for (var i = 0; i < this.maxLines; i++) {
			html += '<div class="log-message" id="' + i + '"></div>';
		}
		j('.game-log').html(html);
	},

	write: function(msg) {
		var toSet = (this.lastSet - 1 + this.maxLines) % this.maxLines;
		for (var i = this.maxLines - 1; i >= 0; i--) {
			if (!this.inUse[i]) {
				toSet = i;
				break;
			}
		}
		j('.log-message#' + toSet).text(msg).stop(true, true).css({
			'opacity': 0
		}).animate({ opacity: '1' }, { duration: 500 } ).
		animate({ opacity: '1' }, { duration: 1000 }).
		animate({ opacity: '0' }, { duration: 1000, complete: function() {
			var id = $(this).attr('id');
			Log.inUse[id] = false;
		}});
		this.lastSet = toSet;
		this.inUse[toSet] = true;
	}
};