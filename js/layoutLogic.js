function updateLayout(root) {

	root = root || document.getElementsByClassName("root")[0];

	console.log("%O", root);

	var dimension, altDimension;
	if (hasClass(root, "horizontal")) {
		dimension = "width";
		altDimension = "height";
	} else {
		dimension = "height";
		altDimension = "width";
	}

	var dimension2 = dimension[0].toUpperCase() + dimension.substr(1);

	var children = (function() {
		var result = {};
		result.all  = Array.apply(0, root.children);
		result.max  = result.all.filter(function(e) { return hasClass(e, "maxSize");      });
		result.rel  = result.all.filter(function(e) { return hasClass(e, "relativeSize"); });
		result.auto = [].concat(result.max, result.rel);
		return result;
	})();

	console.log(children);

	// minify all elements with non-fixed width
	children.auto.forEach(function(e) {
		e.style.removeProperty("width");
		e.style.removeProperty("height");
		addClass(e, "minSize");
	});

	var availableSize = root["offset" + dimension2];

	var sizeToSpend = Math.max(0, availableSize - children.all.filter(function(e) {
		return hasClass(e, "fixedSize") || hasClass(e, "contentSize");
	}).reduce(function(a, b) {
		return a + b["offset" + dimension2];
	}, 0));

	console.log(availableSize, sizeToSpend);

	var relTotalValue = children.rel.reduce(function(a, b) {
		return a + (b.relativeSizeValue || 0);
	}, 0);

	var sizeForMax = Math.max(0, sizeToSpend * (1 - relTotalValue));

	children.rel.forEach(function(e) {
		removeClass(e, "minSize");
		// e.style.removeProperty(altDimension);
		var value = (e.relativeSizeValue || 0) * sizeToSpend;
		e.style[dimension] = value + "px"; //100 * value / availableSize + "%";
	});

	children.max.forEach(function(e) {
		removeClass(e, "minSize");
		// e.style.removeProperty(altDimension);
		var value = sizeForMax / children.max.length;
		e.style[dimension] = value + "px"; //100 * value / availableSize + "%";
	});

	root.children && Array.prototype.forEach.call(root.children, function(e) { updateLayout(e); });

}