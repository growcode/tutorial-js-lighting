(function () {
	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function (fn) {
			setTimeout(fn, 20);
		};
	}
}());
