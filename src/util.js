function rand(lo, hi) {
	return Math.random() * (hi - lo) + lo;
}
function randInt(lo, hi) {
	return Math.floor(rand(lo, hi));
}
function randIntInc(lo, hi) {
	return randInt(lo, hi + 1);
}
function randItem(array) {
	return array[randInt(0, array.length)];
}

function clamp(val, lo, hi) {
	return Math.max(lo, Math.min(hi, val));
}
function clamp01(val) {
	return clamp(val, 0, 1);
}
function lerp(t, from, to) {
	return clamp01(t) * (to - from) + from;
}

function distance(x1, y1, x2, y2) {
	var dx = x2 - x1;
	var dy = y2 - y1;
	return Math.sqrt(dx * dx + dy * dy);
}
function vecDistance(vec1, vec2) {
	return distance(vec1.x, vec1.y, vec2.x, vec2.y);
}

function removeItem(item, list) {
	var index = list.indexOf(item);
	if (index >= 0) {
		list.splice(index, 1);
		return true;
	}
	return false;
}

function formatNumber(x, precision, report) {
	if (precision === undefined) {
		precision = 2;
	}

	var parts = x.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	if (parts.length > 1) {
		var decimal = parts[1];
		if (decimal.length > precision) {
			decimal = Math.round(parts[1].slice(0, precision + 1) / 10).toString();
			while (decimal.length < precision) {
				// we lose leading 0s when converting to a number; re-add them
				decimal = '0' + decimal;
			}
		}
		decimal = decimal.slice(0, precision);
		for (var i = decimal.length - 1; i >= 0; i--) {
			if (decimal[i] === '0') {
				decimal = decimal.slice(0, i);
			}
			else {
				break;
			}
		}
		if (decimal.length > 0) {
			parts[1] = '.' + decimal;
		}
		else {
			parts[1] = '';
		}
	}
	return parts.join('');
}

function getButtonHtml(onclick, contents, id, extraClass) {
	var idStr = id ? ' id="' + id + '"' : '';
	var classStr = 'class="button';
	if (extraClass) {
		classStr += ' ' + extraClass;
	}
	classStr += '"';
	return '<div ' + classStr + ' onclick="' + onclick + '; hideButtonDescription(this)"' +
		' onmouseover="showButtonDescription(this)" onmouseout="hideButtonDescription(this)"' +
		idStr + '><span class="content">' + contents + '</span>' +
		'<div class="description" style="display:none"></div>' +
		'</div>';
}

function showButtonDescription(button) {
	var obj = $(button).find('.description');
	if (obj.html()) {
		j('.description-box').show().css({
			left: Game.mouse.x,
			top: Game.mouse.y
		});
		j('.description-box', 'html', obj.html());
	}
}
function hideButtonDescription(button) {
	j('.description-box').hide();
}

function foreach(target, toDo) {
	for (var i in target) {
		toDo(target[i], i);
	}
}

var j = function(id) {
	var cache = {};
	return function(id) {
		if (arguments.length == 1) {
			if (!(id in cache)) {
				cache[id] = $(id);
			}
			return cache[id];
		}
		else {
			var func = arguments[1];
			var key = id + '#' + func;
			var args = [];
			for (var i = 2; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
			if (cache[key] !== args.toString()) {
				cache[key] = args.toString();
				var f = j(id)[func];
				f.apply(j(id), args);
			}
		}
	};
}();

var TimerManager = {
	active: [],

	skipFrame: 0,
	maxSkipFrame: 2,

	update: function() {
		if (!Options.fancyGraphics) {
			this.skipFrame = (this.skipFrame + 1) % this.maxSkipFrame;
			if (this.skipFrame !== 0) {
				return;
			}
		}

		for (var i = this.active.length - 1; i >= 0; i--) {
			this.active[i]();
		}
	},

	create: function(action, duration) {
		var func = function() {
			var t = 0;
			return function() {
				var dt = Game.realtimeDt / duration;
				if (!Options.fancyGraphics) {
					dt *= TimerManager.maxSkipFrame;
				}

				t += dt;
				if (action(clamp01(t)) || t >= 1) {
					removeItem(func, TimerManager.active);
				}
			};
		}();

		this.active.push(func);
	}
};

function shallowClone(base) {
	var newObj = {};
	for (var key in base) {
		newObj[key] = base[key];
	}
	return newObj;
}

function merge(base, supp) {
	var newObj = shallowClone(base);
	for (var key in supp) {
		if (newObj[key] === undefined) {
			newObj[key] = supp[key];
		}
	}
	return newObj;
}
