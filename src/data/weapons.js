function loadWeapons() {
	var weapons = {
		'knife': new WeaponDef({
			displayName: 'Knife',
			owned: true,
			scalingBase: {
				strength: 5,
				dexterity: 70
			},
			damage: 5,
			crit: 9,
			upgradeData: {
				crit: 10,
				critDamage: 10
			}
		}),
		'dagger': new WeaponDef({
			displayName: 'Dagger',
			scalingBase: {
				strength: 10,
				dexterity: 55
			},
			buyCost: 500,
			damage: 6,
			crit: 8,
			upgradeData: {
				damage: 5,
				critDamage: 25
			}
		}),
		'shortsword': new WeaponDef({
			displayName: 'Shortsword',
			scalingBase: {
				strength: 25,
				dexterity: 40
			},
			buyCost: 1500,
			damage: 7,
			crit: 5,
			upgradeData: {
				damage: 8,
				crit: 10
			}
		}),
		'longsword': new WeaponDef({
			displayName: 'Longsword',
			scalingBase: {
				strength: 45,
				dexterity: 30
			},
			buyCost: 5000,
			damage: 8,
			crit: 5,
			upgradeData: {
				damage: 10,
				critDamage: 10
			}
		}),
		'rapier': new WeaponDef({
			displayName: 'Rapier',
			scalingBase: {
				strength: 20,
				dexterity: 60
			},
			buyCost: 7500,
			damage: 8,
			crit: 6.5,
			upgradeData: {
				crit: 12,
				defense: 10
			}
		}),
		'greatsword': new WeaponDef({
			displayName: 'Greatsword',
			scalingBase: {
				strength: 80
			},
			buyCost: 15000,
			damage: 10,
			crit: 3,
			upgradeData: {
				damage: 15
			}
		}),
		'greatersword': new WeaponDef({
			displayName: 'Greatersword',
			scalingBase: {
				strength: 85,
				dexterity: 20
			},
			buyCost: 50000,
			researchCost: 1500,
			damage: 12,
			crit: 5,
			upgradeData: {
				damage: 16,
				defense: 2
			},
			prereqs: {
				buildings: {
					'research-center': 1
				}
			}
		}),
		'shamshir': new WeaponDef({
			displayName: 'Shamshir',
			scalingBase: {
				strength: 20,
				dexterity: 85
			},
			buyCost: 50000,
			researchCost: 1500,
			damage: 11,
			crit: 6,
			upgradeData: {
				damage: 8,
				crit: 8,
				critDamage: 10
			},
			prereqs: {
				buildings: {
					'research-center': 1
				}
			}
		}),
		'rune-dagger': new WeaponDef({
			displayName: 'Rune Dagger',
			scalingBase: {
				dexterity: 40,
				intelligence: 30
			},
			buyCost: 250000,
			researchCost: 5000,
			damage: 9,
			crit: 6,
			spellPower: 20,
			upgradeData: {
				crit: 8,
				manaRegen: 12
			},
			prereqs: {
				buildings: {
					'training-hall': 1
				}
			}
		}),
		'wand': new WeaponDef({
			displayName: 'Wand',
			scalingBase: {
				intelligence: 50
			},
			buyCost: 250000,
			researchCost: 5000,
			damage: 7,
			crit: 3,
			spellPower: 50,
			upgradeData: {
				spellPower: 8,
				maxMana: 5
			},
			prereqs: {
				buildings: {
					'training-hall': 1
				}
			}
		}),
	};
	foreach (weapons, function(weapon, key) {
		weapon.name = key;
	});
	return weapons;
}
