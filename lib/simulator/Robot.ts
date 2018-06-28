'use strict';

import {Behavior} from '../behavior';
import {getRandomInt, Point, Wall} from '../utils';
import {ExtendedWindowObj} from '../types';
import {Goal} from './Goal';
import {CanvasView} from './CanvasView';


declare const window: ExtendedWindowObj;

const CSS_COLOR_NAMES = ['AliceBlue', 'AntiqueWhite', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque', 'Black', 'BlanchedAlmond', 'Blue', 'BlueViolet', 'Brown', 'BurlyWood', 'CadetBlue', 'Chartreuse', 'Chocolate', 'Coral', 'CornflowerBlue', 'Cornsilk', 'Crimson', 'Cyan', 'DarkBlue', 'DarkCyan', 'DarkGoldenRod', 'DarkGray', 'DarkGrey', 'DarkGreen', 'DarkKhaki', 'DarkMagenta', 'DarkOliveGreen', 'Darkorange', 'DarkOrchid', 'DarkRed', 'DarkSalmon', 'DarkSeaGreen', 'DarkSlateBlue', 'DarkSlateGray', 'DarkSlateGrey', 'DarkTurquoise', 'DarkViolet', 'DeepPink', 'DeepSkyBlue', 'DimGray', 'DimGrey', 'DodgerBlue', 'FireBrick', 'FloralWhite', 'ForestGreen', 'Fuchsia', 'Gainsboro', 'GhostWhite', 'Gold', 'GoldenRod', 'Gray', 'Grey', 'Green', 'GreenYellow', 'HoneyDew', 'HotPink', 'IndianRed', 'Indigo', 'Ivory', 'Khaki', 'Lavender', 'LavenderBlush', 'LawnGreen', 'LemonChiffon', 'LightBlue', 'LightCoral', 'LightCyan', 'LightGoldenRodYellow', 'LightGray', 'LightGrey', 'LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen', 'LightSkyBlue', 'LightSlateGray', 'LightSlateGrey', 'LightSteelBlue', 'LightYellow', 'Lime', 'LimeGreen', 'Linen', 'Magenta', 'Maroon', 'MediumAquaMarine', 'MediumBlue', 'MediumOrchid', 'MediumPurple', 'MediumSeaGreen', 'MediumSlateBlue', 'MediumSpringGreen', 'MediumTurquoise', 'MediumVioletRed', 'MidnightBlue', 'MintCream', 'MistyRose', 'Moccasin', 'NavajoWhite', 'Navy', 'OldLace', 'Olive', 'OliveDrab', 'Orange', 'OrangeRed', 'Orchid', 'PaleGoldenRod', 'PaleGreen', 'PaleTurquoise', 'PaleVioletRed', 'PapayaWhip', 'PeachPuff', 'Peru', 'Pink', 'Plum', 'PowderBlue', 'Purple', 'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Salmon', 'SandyBrown', 'SeaGreen', 'SeaShell', 'Sienna', 'Silver', 'SkyBlue', 'SlateBlue', 'SlateGray', 'SlateGrey', 'Snow', 'SpringGreen', 'SteelBlue', 'Tan', 'Teal', 'Thistle', 'Tomato', 'Turquoise', 'Violet', 'Wheat', 'White', 'WhiteSmoke', 'Yellow', 'YellowGreen'];
export const SIDES_OF_THE_WORLD = ['north', 'east', 'south', 'west'];		// (or robotFacing) clockwise
let behavior = new Behavior();


export class Robot {

	theta = 0;
	lastX = this.x;
	lastY = this.y;
	lastF = this.f;

	static assemble = (goal: Goal, canvasView: CanvasView): Robot => new Robot(
		getRandomInt(0, canvasView.maxX - 1),
		getRandomInt(0, canvasView.maxY - 1),
		CSS_COLOR_NAMES[getRandomInt(0, CSS_COLOR_NAMES.length - 1)],
		SIDES_OF_THE_WORLD[getRandomInt(0, SIDES_OF_THE_WORLD.length - 1)],
		goal,
		canvasView,
	);

	protected constructor(
		public x: number,
		public y: number,
		public color: string,
		public f: string,
		public goal: Goal,
		public canvasView: CanvasView,
	) {
	}

	atGoal(): boolean {
		return (this.x === this.goal.x && this.y === this.goal.y);
	}

	step(event) {
		behavior.handleEvent(this, event)
			.then(result => {
				console.log('handleEvent then:', result);
			})
			.catch(err => {
				console.log('handleEvent catch:', err)
			});
	}

	stepAi() {
		this.step(this.buildEvent());
	}

	buildEvent() {
		return {
			// Note distance to goal is actually the square of the distance to goal
			distanceToGoal: Math.pow(this.x - this.goal.x, 2) + Math.pow(this.y - this.goal.y, 2),
			atGoal: this.atGoal(),
			wallInFront: this.canvasView.wallInFront(this),
		};
	}

	isClean(wallToCheck: Wall): boolean {
		const isBlocked = this.canvasView.theWall.some(wall => wall.identicalTo(wallToCheck));
		if (isBlocked) {
			window.simulator.printErrors(`Robot ${this.color}[${this.x},${this.y}]: there is a wall in front of me`);
		}
		return !isBlocked;
	}


	/* --------------------------------------------------- *
	 *         the following are command functions				 *
	 * --------------------------------------------------- */
	place(cmd) {
		var newPos = cmd.split(','); // get x y f from the command
		if (newPos.length < 3) {
			window.simulator.printErrors('incorrect position / direction');
		} else {
			var newX = parseInt(newPos[0].trim()),
				newY = parseInt(newPos[1].trim()),
				newF = newPos[2].trim().toLowerCase();

			if (this.canvasView.isBoundValid(newX, 'maxX') &&
				this.canvasView.isBoundValid(newY, 'maxY') &&
				CanvasView.isFacingValid(newF)) {
				this.x = newX;
				this.y = newY;
				this.f = newF;
			}
		}
	}

	move() {
		let wallToCheck: Wall;
		this.theta = 0;
		this.lastX = this.x;
		this.lastY = this.y;

		switch (this.f) {
			case 'north': {
				wallToCheck = new Wall(new Point(this.x, this.y + 1), new Point(this.x + 1, this.y + 1));
				let newY = this.y + 1;
				if (this.canvasView.isBoundValid(newY, 'maxY') && this.isClean(wallToCheck)) {
					this.y = newY;
				}
				break;
			}
			case 'south': {
				wallToCheck = new Wall(new Point(this.x, this.y), new Point(this.x + 1, this.y));
				let newY = this.y - 1;
				if (this.canvasView.isBoundValid(newY, 'maxY') && this.isClean(wallToCheck)) {
					this.y = newY;
				}
				break;
			}
			case 'east': {
				wallToCheck = new Wall(new Point(this.x + 1, this.y), new Point(this.x + 1, this.y + 1));
				let newX = this.x + 1;
				if (this.canvasView.isBoundValid(newX, 'maxX') && this.isClean(wallToCheck)) {
					this.x = newX;
				}
				break;
			}
			case 'west': {
				wallToCheck = new Wall(new Point(this.x, this.y), new Point(this.x, this.y + 1));
				let newX = this.x - 1;
				if (this.canvasView.isBoundValid(newX, 'maxX') && this.isClean(wallToCheck)) {
					this.x = newX;
				}
				break;
			}
			default:
				throw `wrong direction: ${this.f}`;
		}

	}

	left() {
		this.rotate(false); // get the next from this.robotFacing array in anti-clockwise direction
	}

	right() {
		this.rotate(true); // get the next from this.robotFacing array in clockwise direction
	}

	rotate(clockwise) {
		this.theta = 0;
		this.lastF = this.f;

		let originalFacing = this.f,
			originalFacingIndex = SIDES_OF_THE_WORLD.indexOf(originalFacing),
			newFacingIndex,
			totalFacing = SIDES_OF_THE_WORLD.length;

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

		this.f = SIDES_OF_THE_WORLD[newFacingIndex];
	}

	update(delta: number) {
		if (this.theta < 1) {
			this.theta += delta / 1000;
		} else {
			this.theta = 1;
			this.lastX = this.x;
			this.lastY = this.y;
			this.lastF = this.f;
		}
	}

}
