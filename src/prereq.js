function prereqsMet(prereqs) {
	var i;

	if (!prereqs) {
		return true;
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

	return true;
}