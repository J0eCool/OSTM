function loadWeapons() {
	var weapons = {
		'stick': new WeaponDef({
			displayName: 'Stick',
			owned: true,
			scalingBase: {
				strength: 45,
				dexterity: 5
			},
			damage: 4,
			crit: 3,
			upgradeData: {
				damage: 5
			}
		}),
		'knife': new WeaponDef({
			displayName: 'Knife',
			scalingBase: {
				strength: 5,
				dexterity: 75
			},
			buyCost: 250,
			damage: 8,
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
				dexterity: 60
			},
			buyCost: 2000,
			damage: 9,
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
			buyCost: 5000,
			damage: 11,
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
			buyCost: 25000,
			damage: 13,
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
			buyCost: 25000,
			damage: 13,
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
			buyCost: 65000,
			damage: 16,
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
			buyCost: 250000,
			researchCost: 1500,
			damage: 17,
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
			buyCost: 500000,
			researchCost: 1500,
			damage: 15,
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
			damage: 10,
			crit: 6,
			spellPower: 20,
			upgradeData: {
				crit: 8,
				manaRegen: 12
			},
			prereqs: {
				buildings: {
					'wizard-tower': 1
				}
			}
		}),
		'wand': new WeaponDef({
			displayName: 'Wand',
			scalingBase: {
				intelligence: 50
			},
			buyCost: 750000,
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
					'wizard-tower': 1
				}
			}
		}),
		'axe': new WeaponDef({
			displayName: 'Axe',
			scalingBase: {
				strength: 75,
				dexterity: 25
			},
			buyCost: 2500000,
			researchCost: 7500,
			damage: 19,
			crit: 5,
			upgradeData: {
				damage: 7,
				maxDamage: 10,
				critDamage: 10
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
