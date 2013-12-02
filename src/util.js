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

function getButtonHtml(onclick, contents, id) {
	var idStr = id ? ' id="' + id + '"' : '';
	return '<div class="button" onclick="' + onclick + '"' + idStr +
		' ><span class="content">' + contents + '</span></div>';
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
