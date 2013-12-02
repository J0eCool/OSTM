function ParticleType(data) {
	this.className = data.className || '';
	this.animHeight = data.animHeight || 100;
	this.animTime = data.animTime || 500;
}

var ParticleContainer = {
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

	getNextParticle: function() {
		while (this.curParticle >= this.particles.length) {
			var id = '#particle-'+this.curParticle;
			this.particles.push(j(id));
		}
		var obj = this.particles[this.curParticle];
		this.curParticle = (this.curParticle + 1) % this.maxParticles;
		return obj;
	},

	create: function(type, val, x, y) {
		var obj = this.getNextParticle();
		obj.stop(true, true).html(val).css({
			'left': x + 'px',
			'top': (y + 64) + 'px',
			'opacity': 1,
			'transform': '',
		}).attr('class', 'particle ' + type.className).animate({
			top: "-=" + type.animHeight + "px",
			opacity: "0"
		}, type.animTime);
	},

	createEffect: function(image, data) {
		if (!Options.fancyGraphics) {
			return;
		}

		var obj = this.getNextParticle();
		var widHeight = 'style="' +
			(data.w ? 'width:' + data.w + 'px;' : '') +
			(data.h ? 'height:' + data.h + 'px;' : '') + '"';
		obj.stop(true, true).html('<img src="' + image + '" ' + widHeight + '></img>').css({
			'left': (data.x || 0) + 'px',
			'top': (data.y || 0) + 'px',
			'opacity': 1,
			'transform': 'rotate(' + (data.deg || 0) + 'deg)',
		}).attr('class', 'particle').animate({
			opacity: "0"
		}, data.fadeTime || 750);
	},
};

var damageParticleType = new ParticleType({
	className: 'damage enemy-damage',
	animHeight: 140,
	animTime: 650
});
var critParticleType = new ParticleType({
	className: 'damage enemy-crit',
	animHeight: 160,
	animTime: 650
});
var playerDamageParticleType = new ParticleType({
	className: 'damage player-damage',
	animHeight: -90,
	animTime: 850
});
var healParticleType = new ParticleType({
	className: 'damage heal',
	animHeight: -75,
	animTime: 500
});
var manaParticleType = new ParticleType({
	className: 'damage mana',
	animHeight: -90,
	animTime: 850
});
var rewardParticleType = new ParticleType({
	className: 'reward',
	animHeight: -70,
	animTime: 1400
});

var getIconHtml = function(type) {
	var cache = {};
	var imgDir = '';
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
