(function () {
	function clamp(value, min, max) {
		return Math.max(min, Math.min(max, value));
	}

	function Shader(images) {
		this.images = images;
	}

	Shader.prototype.update = function (progress) {
		this.images[1].style.opacity = clamp(progress - 0.33, 0, 0.33) / 0.33;
		this.images[2].style.opacity = clamp(progress - 0.66, 0, 0.33) / 0.33;
	};

	window.Shader = Shader;
}());
