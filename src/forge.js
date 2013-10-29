Forge = {
	recipes: {},

	fillOnClick: 1,
	fillPerSecond: 0,
	partialFill: 0,

	update: function() {
		var dT = Game.normalDt / 1000;
		this.partialFill += this.fillPerSecond * dT;
		var filled = Math.floor(this.partialFill);
		if (filled > 0) {
			this.addFill(filled);
			this.partialFill -= filled;
		}
	},

	addFill: function(amount) {
		Player.forge += amount;
	},

	createFillParticle: function(message) {
		var container = $('.forge-container');
		var pos = container.position();
		var x = pos.left + rand(0.2, 0.8) * container.width();
		var y = pos.top + rand(0.2, 0.8) * container.height();
		ParticleContainer.create(forgeParticleType, message, x, y);
	}
};
