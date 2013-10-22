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

function formatNumber(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
function getButtonHtml(onclick, contents) {
	return '<span class="button" onclick="' + onclick + '"><span>' + contents + '</span></span>';
}