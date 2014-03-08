function hasClass(element, className) {
	return new RegExp("\\b" + className + "\\b").test(
		element.className
	);
}

function addClass(element, className) {
	if (!hasClass(element, className)) {
		element.className +=
			(element.className ? " " : "") +
			className;
	}
}

function removeClass(element, className) {

	if (hasClass(element, className)) {
		element.className = (
			element.className.replace(
				new RegExp("(\\s|^)" + className + "(\\s|$)"), " "
			)
		).replace(
			/^\s+|\s+$/g, ""
		);
	}

}

function toggleClass(element, className) {

	hasClass(element, className) ?
		removeClass(element, className) :
		addClass(element, className);

}