// @if DEBUG
function cheatCurrency(p) {
	p = p || 12;
	var amt = Math.pow(10, p);
	foreach (Player.resources, function(r) {
		Player[r].amount += amt;
	});
}
// @endif