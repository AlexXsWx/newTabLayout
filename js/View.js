define(["utils", "Manipulator", "layoutLogic"], function(utils, Manipulator, layoutLogic) {	

	var counter = 0;

	function View(type) {

		var view = this;

		this.element = createElement("div.view");

		var content = createElement("div.content");
		var lbManipulator = new Manipulator(true, false, view);
		var rtManipulator = new Manipulator(false, true, view);

		this.element.appendChild(content);
		this.element.appendChild(lbManipulator.element);
		this.element.appendChild(rtManipulator.element);

		this.container = function() {
			return view.element.parentNode;
		};

		this.setType = function(string) {
			addClass(view.element, string);
		};

		this.updateSize = function() {
			updateLayout(this.element.parentNode);
		};

		type && this.setType(type);

		content.innerHTML = counter++;

	}

	return View;

});