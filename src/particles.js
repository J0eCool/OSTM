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
			'left': x + 'px',
			'top': (y + 64) + 'px',
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
	animHeight: 140,
	animTime: 650
});
critParticleType = new ParticleType({
	className: 'damage enemy-crit',
	animHeight: 160,
	animTime: 650
});
playerDamageParticleType = new ParticleType({
	className: 'damage player-damage',
	animHeight: -90,
	animTime: 850
});
healParticleType = new ParticleType({
	className: 'damage heal',
	animHeight: -75
});
rewardParticleType = new ParticleType({
	className: 'reward',
	animHeight: -70,
	animTime: 1400
});

var getIconHtml = function(type) {
	var cache = {};
	var imgDir = 'img/';
	var imgs = {
		xp: 'XP_text.png',
        gold: 'Gold_icon.png',
        research: 'Goop.png',
        iron: 'Iron.png',
        wood: 'Log.png',
        skill: 'SP.png'
    };
	return function(type) {
		if (!cache[type]) {
			cache[type] = '<img class="icon ' + type + '-icon" src="' +
				imgDir + imgs[type] + '" alt="' + type + '"/>';
		}
		return cache[type];
	};
}();
