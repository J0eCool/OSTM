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

function removeItem(item, list) {
	var index = list.indexOf(item);
	if (index >= 0) {
		list.splice(index, 1);
		return true;
	}
	return false;
}

function formatNumber(x) {
	var parts = x.toString().split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	if (parts.length > 1) {
		parts[1] = parts[1].slice(0, 2);
	}
	return parts.join(".");
}
function getButtonHtml(onclick, contents, id) {
	idStr = id ? ' id="' + id + '"' : '';
	return '<span class="button" onclick="' + onclick + '"' + idStr +
		' ><span class="content">' + contents + '</span></span>';
}

function foreach(target, toDo) {
	for (var i in target) {
		toDo(target[i], i);
	}
}

j = function(id) {
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
