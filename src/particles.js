function ParticleType(data) {
	this.className = data.className || '';
	this.animHeight = data.animHeight || 100;
	this.animTime = data.animTime || 500;
}

var ParticleContainer = {
	curParticle: 0,
	maxParticles: 60,

	particles: null,

	getHtml: function() {
		var html = "";
		for (var i = 0; i < this.maxParticles; i++) {
			html += '<div id="particle-'+i+'"></div>';
		}
		return html;
	},

	getNextParticle: function() {
		if (!this.particles) {
			this.particles = [];
			for (var i = 0; i < this.maxParticles; i++) {
				var id = '#particle-' + i;
				this.particles.push(j(id));
			}
		}
		var obj = this.particles[this.curParticle % this.maxParticles];
		this.curParticle++;
		return obj;
	},

	create: function(type, val, x, y) {
		var baseTop = y + 64;
		var obj = this.getNextParticle();
		var style = obj[0].style;
		obj.html(val).attr('class', 'particle ' + type.className).css('transform', '');
		style.left = x + 'px';
		style.top = baseTop + 'px';
		style.opacity = 1;

		TimerManager.create(function() {
			var height = type.animHeight;
			var startParticle = ParticleContainer.curParticle - 1;
			return function(t) {
				if (startParticle + ParticleContainer.maxParticles <= ParticleContainer.curParticle) {
					style.opacity = 0;
					return true;
				}

				style.opacity = 1 - t;
				style.top = (baseTop - height * t) + 'px';
			};
		}(), type.animTime);
	},

	createEffect: function(image, data) {
		if (!Options.fancyGraphics) {
			return;
		}

		var widHeight = 'style="' +
			(data.w ? 'width:' + data.w + 'px;' : '') +
			(data.h ? 'height:' + data.h + 'px;' : '') + '"';
		var obj = this.getNextParticle();
		var style = obj[0].style;
		obj.html('<img src="' + image + '" ' + widHeight + '></img>').attr('class', 'particle')
			.css('transform', 'rotate(' + (data.deg || 0) + 'deg)');
		style.left = (data.x || 0) + 'px';
		style.top = (data.y || 0) + 'px';
		style.opacity = 1;

		TimerManager.create(function() {
			var startParticle = ParticleContainer.curParticle - 1;
			return function(t) {
				if (startParticle + ParticleContainer.maxParticles <= ParticleContainer.curParticle) {
					t = 1;
				}

				style.opacity = 1 - t;
				return t >= 1;
			};
		}(), data.fadeTime || 750);
		// .animate({
		// 	opacity: "0"
		// }, data.fadeTime || 750);
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
