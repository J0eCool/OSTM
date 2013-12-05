function prereqsMet(prereqs) {
	var i;

	if (!prereqs) {
		return true;
	}

	if (prereqs.playerLevel) {
		if (Player.getLevel() < prereqs.playerLevel) {
			return false;
		}
	}

	if (prereqs.items) {
		for (i = 0; i < prereqs.items.length; i++) {
			if (!Inventory.getItem(prereqs.items[i]).isResearched) {
				return false;
			}
		}
	}

	if (prereqs.adventures) {
		for (i = 0; i < prereqs.adventures.length; i++) {
			if (!AdventureScreen.hasBeat(prereqs.adventures[i])) {
				return false;
			}
		}
	}

	if (prereqs.buildings) {
		for (i in prereqs.buildings) {
			var building = Village.buildings[i];
			if (building && (!building.isResearched || building.count < prereqs.buildings[i])) {
				return false;
			}
		}
	}

	if (prereqs.upgrades) {
		for (i in prereqs.upgrades) {
			var upgrade = Village.upgrades[i];
			if (upgrade && (!upgrade.isResearched || upgrade.count < prereqs.upgrades[i])) {
				return false;
			}
		}
	}

	return true;
}

function canResearch() {
	return prereqsMet({ buildings: { 'research-center': 1 } });
}