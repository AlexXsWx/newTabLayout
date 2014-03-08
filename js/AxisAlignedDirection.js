/**
 *
 *	Setters:
 *		none
 *		right
 *		left
 *		up
 *		down
 *
 *	Getters:
 *		none
 *		right
 *		left
 *		up, top
 *		down, bottom
 *		horizontal, h
 *		vertical, v
 *		ascending
 *		descending
 *
 *	clone()
 *	setFromXY(x, y)
 *	toString()
 *
 */
function AxisAlignedDirection() {

	// x&y
	// string
	// AxAlDi

	var direction = this;

	// == Private ==

		var left  = 1 << 0;
		var right = 1 << 1;
		var up    = 1 << 2;
		var down  = 1 << 3;

		var value = 0;

	// =============

	
	// == Public ==

		// == Setters ==

			direction.__defineSetter__("none", function(v) {
				if (v) value = 0;
			});

			[
				[ "right", right ], 
				[ "left",  left  ], 
				[ "up",    up    ], 
				[ "down",  down  ] 
			].forEach(function(e) {
				direction.__defineSetter__(e[0], function(v) {
					value = v ? e[1] : value & ~e[1];
				});
			});
		
		// =============



		// == Getters ==
			
			direction.__defineGetter__("none", function() {
				return value === 0;
			});

			[
				[ "right",  right ],
				[ "left",   left  ],
				[ "up",     up    ],
				[ "top",    up    ],
				[ "down",   down  ],
				[ "bottom", down  ],

				[ "horizontal", right | left ],
				[ "h",          right | left ],
				[ "vertical",   up    | down ],
				[ "v",          up    | down ],
				[ "ascending",  right | down ],
				[ "descending", left  | up   ]
			].forEach(function(e) {
				direction.__defineGetter__(e[0], function() {
					return !!(value & e[1]);
				});
			});

		// =============



		direction.clone = function() {
			var clone = new AxisAlignedDirection();
			if (direction.none) return clone;
			if (direction.horizontal) {
				direction.right ? clone.right = true : clone.left = true;
			} else {
				direction.up ? clone.up = true : clone.down = true;
			}
			return clone;
		};



		direction.setFromXY = function(x, y) {
			if (Math.abs(x) > Math.abs(y)) {
				x > 0 ? this.right = true : this.left = true;
			} else {
				y > 0 ? this.down = true : this.up = true;
			}
		};



		direction.toString = function() {

			switch(true) {
				case value === 0:
					return "none";
				case value & (left | right | up | down) === 0:
				case value.toString(2).split("1").length > 2:
					return "invalid";
			}

			switch(value) {
				case up:    return "up";
				case down:  return "down";
				case left:  return "left";
				case right: return "right";
			}

		};

	// ============

}