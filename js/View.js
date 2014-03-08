define(["utils", "Manipulator", "layoutLogic"], function(utils, Manipulator, layoutLogic) {	

	var counter = 0;

	function View(type) {

		var view = this;

		this.element = createElement("div.view");

		var content = createElement("div.content");

		function init() {

			view.element.appendChild(content);

			view.element.appendChild(
				new Manipulator(
					Manipulator.RIGHT | Manipulator.TOP, view
				).element
			);
			view.element.appendChild(
				new Manipulator(
					Manipulator.LEFT | Manipulator.BOTTOM, view
				).element
			);

			type && view.setType(type);

			content.innerHTML = counter++;

		}

		this.container = function() {
			return view.element.parentNode;
		};

		this.setType = function(string) {
			addClass(view.element, string);
		};

		this.updateSize = function() {
			updateLayout(this.element.parentNode);
		};

		init();

	}

	return View;

});