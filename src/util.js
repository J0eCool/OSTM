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
