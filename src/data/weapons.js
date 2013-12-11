function loadWeapons() {
	var weapons = {
		'stick': new WeaponDef({
			displayName: 'Stick',
			owned: true,
			scalingBase: {
				strength: 40,
			},
			damage: 4,
			spellPower: 7,
			crit: 3,
			upgradeData: {
				damage: 5
			}
		}),
		'knife': new WeaponDef({
			displayName: 'Knife',
			scalingBase: {
				dexterity: 70
			},
			buyCost: 250,
			damage: 8,
			spellPower: 5,
			crit: 9,
			upgradeData: {
				crit: 10,
				critDamage: 10
			}
		}),
		'dagger': new WeaponDef({
			displayName: 'Dagger',
			scalingBase: {
				dexterity: 60
			},
			buyCost: 2000,
			damage: 9,
			spellPower: 5,
			crit: 8,
			upgradeData: {
				damage: 5,
				critDamage: 25
			}
		}),
		'shortsword': new WeaponDef({
			displayName: 'Shortsword',
			scalingBase: {
				strength: 30,
				dexterity: 40
			},
			buyCost: 5000,
			damage: 11,
			spellPower: 5,
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
				dexterity: 25
			},
			buyCost: 25000,
			damage: 13,
			spellPower: 5,
			crit: 5,
			upgradeData: {
				damage: 10,
				critDamage: 10
			}
		}),
		'rapier': new WeaponDef({
			displayName: 'Rapier',
			scalingBase: {
				dexterity: 60
			},
			buyCost: 25000,
			damage: 13,
			spellPower: 5,
			crit: 6.5,
			upgradeData: {
				crit: 12,
				defense: 10
			}
		}),
		'greatsword': new WeaponDef({
			displayName: 'Greatsword',
			scalingBase: {
				strength: 70
			},
			buyCost: 65000,
			damage: 16,
			spellPower: 5,
			crit: 3,
			upgradeData: {
				damage: 15
			}
		}),
		'greatersword': new WeaponDef({
			displayName: 'Greatersword',
			scalingBase: {
				strength: 75,
				dexterity: 8
			},
			buyCost: 250000,
			researchCost: 1500,
			damage: 17,
			spellPower: 5,
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
				dexterity: 85
			},
			buyCost: 500000,
			researchCost: 1500,
			damage: 15,
			spellPower: 5,
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
		'axe': new WeaponDef({
			displayName: 'Axe',
			scalingBase: {
				strength: 80,
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
		'rune-dagger': new WeaponDef({
			displayName: 'Rune Dagger',
			scalingBase: {
				dexterity: 60,
				intelligence: 30
			},
			buyCost: 250000,
			researchCost: 5000,
			damage: 10,
			spellPower: 12,
			crit: 7,
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
				dexterity: 25,
				intelligence: 65
			},
			buyCost: 750000,
			researchCost: 5000,
			damage: 7,
			spellPower: 15,
			crit: 3,
			upgradeData: {
				spellPower: 12,
				manaRegen: 7
			},
			prereqs: {
				buildings: {
					'wizard-tower': 1
				}
			}
		}),
		'staff': new WeaponDef({
			displayName: 'Staff',
			scalingBase: {
				strength: 35,
				intelligence: 50,
				wisdom: 30
			},
			buyCost: 1500000,
			researchCost: 12500,
			damage: 10,
			spellPower: 18,
			crit: 3,
			upgradeData: {
				spellPower: 10,
				maxMana: 8
			},
			prereqs: {
				buildings: {
					'wizard-tower': 1
				}
			}
		}),
		'scepter': new WeaponDef({
			displayName: 'Scepter',
			scalingBase: {
				strength: 60,
				wisdom: 60
			},
			buyCost: 2500000,
			researchCost: 20000,
			damage: 15,
			spellPower: 15,
			crit: 5,
			upgradeData: {
				damage: 10,
				manaRegen: 10
			},
			prereqs: {
				buildings: {
					'wizard-tower': 1
				}
			}
		}),
	};
	foreach (weapons, function(weapon, key) {
		weapon.name = key;
	});
	return weapons;
}
