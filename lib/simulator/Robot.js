'use strict';

import {Behavior} from '../behavior';
import {getRandomInt} from '../utils';

let behavior = new Behavior();

export class Robot {

	constructor() {
		this.x = getRandomInt(0, 4);
		this.y = getRandomInt(0, 4);
		this.color = 'black';
		this.f = ['north', 'east', 'south', 'west'][getRandomInt(0, 3)];
		console.log(`Robot positioned at ${this.x}, ${this.y}, ${this.f}`);
	}

	step(event) {
		behavior.handleEvent(this, event);
	}

	/* --------------------------------------------------- */
	/*         the following are command functions
	 /* --------------------------------------------------- */
	place(cmd) {
		var newPos = cmd.split(","); // get x y f from the command
		if (newPos.length < 3) {
			this.printErrors("incorrect position / direction");
		} else {
			var newX = parseInt(newPos[0].trim()),
				newY = parseInt(newPos[1].trim()),
				newF = newPos[2].trim().toLowerCase();

			if (window.canvasView.validateBound(newX, "maxX") &&
				window.canvasView.validateBound(newY, "maxY") &&
				window.canvasView.validateFacing(newF)) {
				this.x = newX;
				this.y = newY;
				this.f = newF;
			}
		}
	}

	move() {

		switch (this.f) {
		case "north": {
			let newY = this.y + 1;
			if (window.canvasView.validateBound(newY, "maxY")) {
				this.y = newY;
			}
			break;
		}
		case "south": {
			let newY = this.y - 1;
			if (window.canvasView.validateBound(newY, "maxY")) {
				this.y = newY;
			}
			break;
		}
		case "east": {
			let newX = this.x + 1;
			if (window.canvasView.validateBound(newX, "maxX")) {
				this.x = newX;
			}
			break;
		}
		case "west": {
			let newX = this.x - 1;
			if (window.canvasView.validateBound(newX, "maxX")) {
				this.x = newX;
			}
			break;
		}
		default:
			break;
		}


	}
	left() {
		this.rotate(false); // get the next from this.robotFacing array in anti-clockwise direction
	}

	right() {
		this.rotate(true); // get the next from this.robotFacing array in clockwise direction
	}

	rotate(clockwise) {
		var originalFacing = this.f,
			originalFacingIndex = window.canvasView.robotFacing.indexOf(originalFacing),
			newFacingIndex,
			totalFacing = window.canvasView.robotFacing.length;

		if (clockwise) {
			if (originalFacingIndex === (totalFacing - 1)) {
				newFacingIndex = 0;
			} else {
				newFacingIndex = originalFacingIndex + 1;
			}
		} else {
			if (originalFacingIndex === 0) {
				newFacingIndex = totalFacing - 1;
			} else {
				newFacingIndex = originalFacingIndex - 1;
			}
		}

		this.f = window.canvasView.robotFacing[newFacingIndex];

	}

}
