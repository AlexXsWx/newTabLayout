var VIEW_MIN_WIDTH  = 40;
var VIEW_MIN_HEIGHT = 40;

var updateLayout;

require(["class"], function() {

	updateLayout = function(root) {

		if (!root) return;

		function proceedContainer(container) {

			console.debug("Proceeding container", container);

			function sumWidth(arr) {

				function getViewMinWidth(view) {
					var result = 0;
					if (hasClass(view, "fixedWidth")) {
						result = view.getAttribute("width") || 0;
					} else
					if (hasClass(view, "contentWidth")) {
						result = view.content.contentWidth;
					}
					return Math.max(result, VIEW_MIN_WIDTH);
				}

				return arr.reduce(function(sum, e) {
					return sum + getViewMinWidth(e);
				}, 0);

			}

			var children = (function(container) {

				function filter(arr, className) {
					return arr.filter(function(e) {
						return hasClass(e, className);
					});
				}

				var all = Array.prototype.filter.call(
					container.children,
					function(e) {
						return hasClass(e, "container") || hasClass(e, "view");
					}
				);

				return {
					all:           all,
					fixedSized:    filter(all, "fixedWidth"),
					contentSized:  filter(all, "contentWidth"),
					relativeSized: filter(all, "relativeWidth"),
					autoSized:     all.filter(function(e) {
						return hasClass(e, "autoWidth") || (
							!hasClass(e, "fixedWidth")   &&
							!hasClass(e, "contentWidth") &&
							!hasClass(e, "relativeWidth")
						);
					})
				};

			})(container);

			console.debug("Its children are", children);

			

			var containerWidth = container.offsetWidth;

			var availableWidth = containerWidth - 
				sumWidth(children.fixedSized) -
				sumWidth(children.contentSized);

			var totalRealtiveWidth = children.relativeSized.reduce(
				function(sum, e) {
					return sum + Number(
						(e.getAttribute("width") || "0").replace("%", "")
					);
				}, 0
			);

			var totalAutoRelativeWidth = Math.max(0,
				100 - totalRealtiveWidth
			);

			var widthLeftForAutoSized = Math.max(0,
				containerWidth -
				availableWidth -
				containerWidth * (totalRealtiveWidth / 100.0)
			);

			Array.prototype.forEach.call(
				container.querySelectorAll(".container"),
				proceedContainer
			);

			Array.prototype.forEach.call(
				container.querySelectorAll(".view"),
				proceedView
			);

		}

		function proceedView(view) {
			console.debug("Proceeding view", view);
			// var a = view.getAttribute("width");
			// if (a !== null) {
			// 	if (hasClass(view, "fixedWidth")) {
			// 		view.style.width = a + "px";
			// 	} else
			// 	if (hasClass(view, "relativeWidth")) {
			// 		view.style.width = number;
			// 	} else
			// 	if (hasClass(view, "autoWidth")) {

			// 	}
			// }
		}

		proceedContainer(root);

	}

});