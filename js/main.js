require(["utils", "View", "layoutLogic"], function(utils, View, layoutLogic) {

	var root = createElement("div.root");
	document.body.appendChild(root);

	var v = new View("maxSize");
	root.appendChild(v.element);

	v.updateSize();

	window.addEventListener("resize", function() {
		updateLayout(root);
	});

});