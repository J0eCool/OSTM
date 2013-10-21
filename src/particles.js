function ParticleType(data) {
	this.className = data.className || '';
	this.animHeight = data.animHeight || 100;
	this.animTime = data.animTime || 500;
}

ParticleContainer = {
	curParticle: 0,
	maxParticles: 30,

	particles: [],

	getHtml: function() {
		var html = "";
		for (var i = 0; i < this.maxParticles; i++) {
			html += '<div id="particle-'+i+'"></div>';
		}
		return html;
	},

	create: function(type, val, x, y) {
		while (this.curParticle >= this.particles.length) {
			var id = '#particle-'+this.curParticle;
			this.particles.push($(id));
		}
		var obj = this.particles[this.curParticle];
		obj.stop(true, true).html(val).css({
			'left': 100 * x / Game.windowSize.width + '%',
			'top': 100 * (y + 64) / Game.windowSize.height + '%',
			'opacity': 1
		}).attr('class', 'particle ' + type.className).animate({
			top: "-=" + type.animHeight + "px",
			opacity: "0"
		}, type.animTime);
		this.curParticle = (this.curParticle + 1) % this.maxParticles;
	}
};

damageParticleType = new ParticleType({
	className: 'damage enemy-damage',
	animHeight: 120,
	animTime: 350
});
playerDamageParticleType = new ParticleType({
	className: 'damage player-damage',
	animHeight: -80,
	animTime: 450
});
healParticleType = new ParticleType({
	className: 'damage heal',
	animHeight: -75
});
rewardParticleType = new ParticleType({
	className: 'reward',
	animHeight: 140,
	animTime: 1200
});
forgeParticleType = new ParticleType({
	className: 'damage forge-plus'
});

function getIconHtml(type) {
	return '<img class="icon ' + type + '-icon" />';
};
