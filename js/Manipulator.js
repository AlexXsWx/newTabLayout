define([ "utils", "AxisAlignedDirection", "View" ],
function(utils, AADirection, View) {

	var staticData = {
		RIGHT:  1,
		LEFT:   2,
		TOP:    4,
		BOTTOM: 8,
		minDragDistance: 10
	};



	function Manipulator(position, owner) {

		var manipulator = this;

		// == Private ==

			var right  = +!!(position & Manipulator.RIGHT);
			var bottom = +!!(position & Manipulator.BOTTOM);

			var locker = null;

			function lock() {
				if (!owner || !owner.element || locker) return;
				owner.element.addChildNode(
					locker = createElement("div.manipulatorsLocker")
				);
			}

			function unlock() {
				if (!owner || !owner.element || !locker) return;
				owner.element.removeChild(locker);
				locker = null;
			}



			function dragStart(e) {

				var startX, startY;
				var container, view;
				var newContainer, newView;

				var containerIsHorizontal;
				var containerIsVertical;


				var viewToRemove;
				function cancelViewRemove() {
					if (viewToRemove) {
						removeClass(viewToRemove, "prepareRemove");
						viewToRemove = null;
					}
				}
				function setViewToRemove(e) {
					if (hasClass(e, "view")) {
						cancelViewRemove();
						viewToRemove = e;
						addClass(e, "prepareRemove");
					}
				}



				var dragMoveAction;



				function decideDragDirection(e) {

					var dx = e.x - startX;
					var dy = e.y - startY;

					if (Math.sqrt(dx * dx + dy * dy) < Manipulator.minDragDistance) {
						return;
					}

					var dir = new AADirection();
					dir.setFromXY(dx, dy);

					var dragExtends =
						dir.horizontal && dir.ascending == right ||
						dir.vertical   && dir.ascending == bottom;

					var directionMatchesContainerType =
						dir.horizontal == containerIsHorizontal;

					// get action

					if (container.children.length === 1) {

						if (dragExtends) {
							console.debug("ignoring drag outside");
							return;
						}

						newView = new View();
						newView.setType("maxSize");

						container.className = "container maxSize ";
						container.className += dir.h ? "horizontal" : "vertical";
						containerIsHorizontal = direciton.horizontal;
						containerIsVertical = !containerIsHorizontal;

						if (dir.ascending) {
							container.insertBefore(newView.element, view);
						} else {
							container.appendChild(newView.element);
						}

						cancelViewRemove();

						(dragMoveAction = adjustViews)(e);

					} else {

						// container has at least 2 elements

						var i = Array.prototype.indexOf.call(container.children, view);
						var viewIsFirst = i === 0;
						var viewIsLast  = i === container.children.length - 1;

						if (
							dragExtends && (
								!directionMatchesContainerType ||
								viewIsFirst && dir.descending ||
								viewIsLast  && dir.ascending
							)
						) {
							console.debug("ignoring drag outside");
							return;
						}



						if (dragExtends) {

							// collapse existing elements
							console.debug("should've collapse sth");

							setViewToRemove(container.children[
								dir.ascending ? i + 1 : i - 1
							]);

						} else {

							// create new view

							console.debug("should've create new");

							newView = new View();
							newView.setType("maxSize");


							if (directionMatchesContainerType) {

								container.insertBefore(
									newView.element,
									dir.ascending ? view : view.nextSibling
								);

							} else {

								// need new container

								newContainer = createElement("div.container.maxSize");
								if (dir.horizontal) {
									newContainer.className += " horizontal";
									newContainer.style.height = view.style.height;
								} else {
									newContainer.className += " vertical";
									newContainer.style.width = view.style.width;
								}

								var position = view.nextSibling;
								container.removeChild(view);

								if (dir.ascending) {
									newContainer.appendChild(newView.element);
									newContainer.appendChild(view);
								} else {
									newContainer.appendChild(view);
									newContainer.appendChild(newView.element);
								}

								container.insertBefore(newContainer, position);

							}

							cancelViewRemove();

							(dragMoveAction = adjustViews)(e);

						}


					}

				}


				function adjustViews(e) {
					// console.log("adjusting");
					owner && owner.updateSize && owner.updateSize();
				}



				function dragStart(e) {
					// console.log("dragstart", e);
					view = owner || e.target.parentNode;
					container = view.parentNode;
					console.assert(
						container.children.length > 0,
						"container has no children"
					);
					console.assert(
						hasClass(container, "container"),
						"parent is not container"
					);
					containerIsHorizontal = hasClass(container, "horizontal");
					containerIsVertical   = hasClass(container, "vertical");
					startX = e.x;
					startY = e.y;
					dragMoveAction = decideDragDirection;
					lock();
				}

				function dragMove(e) {
					// console.log("dragmove", e);
					dragMoveAction(e);
				}

				function dragEnd(e) {
					// console.log("dragend", e);
					if (viewToRemove) {
						container.removeChild(viewToRemove);
						var parent = container.parentNode;
						if (
							container.children.length === 1 &&
							hasClass(parent, "container")
						) {
							var position = container.nextSibling;
							var view = container.children[0];
							container.removeChild(view);
							parent.removeChild(container);
							parent.insertBefore(view, position);
						}
						// recalcSizes();
					}
				}

				function dragCancel() {
					// console.log("dragcancel");
					cancelViewRemove();
					unlock();
				}

				// == Under the hood ==

					dragStart(e);

					function mouseUpListener(e) {
						clearCallbacks();
						dragEnd(e);
					}
					function keyListener(e) {
						console.log(e);
						if (e.keyCode === 27) { // ESC
							clearCallbacks();
							dragCancel();
						}
					}
					function clearCallbacks() {
						window.removeEventListener("mousemove", dragMove);
						window.removeEventListener("keydown", keyListener);
						window.removeEventListener("mouseup", mouseUpListener);
					}

					window.addEventListener("mousemove", dragMove);
					window.addEventListener("keydown", keyListener);
					window.addEventListener("mouseup", mouseUpListener);

					e.preventDefault();

				// ====================

			}

		// =============

		

		this.element = createElement(
			"div.manipulator" + (
				right ? ".right" : ".left"
			) + (
				bottom ? ".bottom" : ".top"
			),
			null,
			{ draggable: true },
			{ ondragstart: dragStart }
		);

	}

	for (var key in staticData) {
		Manipulator[key] = staticData[key];
	}



	return Manipulator;

});