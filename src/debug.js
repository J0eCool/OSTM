// @if DEBUG
function getDebugScreenHtml() {
	return getButtonHtml("debugAddCurrency()", 'Add currency') +
		getButtonHtml("debugResetCurrency()", 'Reset currency') + '<br>' +
		getButtonHtml("debugCompleteAdventures()", 'Unlock adventures') +
		getButtonHtml("debugResetAdventures()", 'Reset adventures') + '<br>' +
		getButtonHtml("debugResetWeapons()", 'Reset weapons') +
		getButtonHtml("debugResetSkills()", 'Reset skills') +
		getButtonHtml("debugResetVillage()", 'Reset village');
}

function debugAddCurrency(p) {
	p = p || 12;
	var amt = Math.pow(10, p);
	foreach (Player.resources, function(r) {
		Player[r].amount += amt;
	});
}

function debugResetCurrency() {
	foreach (Player.resources, function(r) {
		Player[r].amount = 0;
	});
}

function debugCompleteAdventures() {
	foreach (AdventureScreen.adventures, function(a) {
		a.beatOnPower = 9999;
	});
}

function debugResetAdventures() {
	foreach (AdventureScreen.adventures, function(a) {
		a.beatOnPower = -1;
	});
}

function debugResetWeapons() {
	foreach (Blacksmith.weapons, function(w) {
		w.level = 0;
		w.ascensions = 0;
	});
}

function debugResetSkills() {
	foreach (Skills.skills, function(s) {
		s.level = 0;
	});
	Skills.skills.attack.level = 1;
	Player.attackName = 'attack';
}

function debugResetVillage() {
	foreach (Village.buildings, function(b) {
		if (!b.maxCount) {
			b.count = 0;
		}
	});
	foreach (Village.upgrades, function(u) {
		u.count = 0;
	});
	Player.refreshResourceProduction();
}
// @endif
