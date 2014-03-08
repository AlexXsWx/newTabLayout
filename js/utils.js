define(["class"]);

function createElement(selector, css, properties, eventListeners, after) {

	var tagName = selector.match(/^\w+/)[0];

	var id = selector.match(/#-?[_\w][_\w\d-]*/i);
	if (id) id = id[0].substr(1);

	var classNames = selector.match(/\.-?[_\w][_\w\d-]*/gi);
	if (classNames) {
		classNames = classNames.map(function(e) {
			return e.substr(1)
		}).join(" ");
	}

	var element = document.createElement(tagName);
	if (id) element.id = id;
	if (classNames) element.className = classNames;

	if (css) {
		for (var key in css) {
			element.style[key] = css[key];
		}
	}

	if (properties) {
		for (var key in properties) {
			element[key] = properties[key];
		}
	}

	if (eventListeners) {
		for (var key in eventListeners) {
			element.addEventListener(key, eventListeners[key]);
		}
	}

	after && after.call(element);

	return element;

}