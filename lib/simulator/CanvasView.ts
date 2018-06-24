'use strict';

import {ExtendedWindowObj} from '../types';

declare const window: ExtendedWindowObj;


export class CanvasView {

	maxX = 5; // x total
	maxY = 5; // y total
	squareSize = 100; // all grids are equal width and height
	xStart = 50; // axis x starts from 50px
	yStart = 50; // axis y starts from 50px
	xEnd = this.xStart + this.squareSize * this.maxX; // axis x starts from 50px
	yEnd = this.yStart + this.squareSize * this.maxY; // axis y starts from 50px
	canvas = document.getElementById('c') as HTMLCanvasElement;
	context = this.canvas.getContext('2d');

	robotFacing = ['north', 'east', 'south', 'west']; // clockwise
	robotSize = 25; // is the arrow size actually

	render() {
		this.context.clearRect(0, 0, 551, 580); // TODO: Magic dimensions from index.ejs
		this.renderCanvas();
		this.renderGoal(window.simulator.getCurrentRobot());
		this.renderRobot();

	}

	stepAi() {
		const robot = window.simulator.getCurrentRobot();
		robot.step(this.buildEvent(robot, window.goal));
	}

	atGoal(robot, goal) {
		return (robot.x === goal.x && robot.y === goal.y);
	}

	wallInFront(robot) {
		switch (robot.f) {
			case 'north': {
				return robot.y === this.maxY - 1;
			}
			case 'south': {
				return robot.y === 0;
			}
			case 'east': {
				return robot.x === this.maxX - 1;
			}
			case 'west': {
				return robot.x === 0;
			}
			default:
				console.log(`Invalid orientation ${robot.f}`);
				return false;
		}

	}

	buildEvent(robot, goal) {
		return {
			// Note distance to goal is actually the square of the distance to goal
			distanceToGoal: Math.pow(robot.x - goal.x, 2) + Math.pow(robot.y - goal.y, 2),
			atGoal: this.atGoal(robot, goal),
			wallInFront: this.wallInFront(robot),
		};
	}

	renderCanvas() {
		this.context.strokeStyle = '#000';

		for (let x = 0; x < (this.maxX + 1); x++) { // draw 6 lines
			const currentAxisX = this.xStart + x * this.squareSize;
			this.context.moveTo(currentAxisX, this.yStart);
			this.context.lineTo(currentAxisX, this.yEnd);

			this.context.strokeText(`${x}`, currentAxisX + 50, this.yEnd + 20); // mark x index
		}

		for (let y = 0; y < (this.maxY + 1); y++) {
			const currentAxisY = this.yStart + y * this.squareSize;
			this.context.moveTo(this.xStart, currentAxisY);
			this.context.lineTo(this.xEnd, currentAxisY);

			this.context.strokeText(`${this.maxY - 1 - y}`, this.xStart - 20, currentAxisY + 50); // mark y index
		}

		this.context.stroke();
	}

	validateBound(input, toCheckAxis) {
		if (isNaN(input)) {
			window.simulator.printErrors('Please enter a numeric coordinates!');
			return false;
		} else if (input < 0 || input > (this[toCheckAxis] - 1)) {
			window.simulator.printErrors('Coordinates out of range!');
			return false;
		} else {
			return true;
		}
	}

	validateFacing(face) {
		if (this.robotFacing.indexOf(face.toLowerCase()) < 0) {
			window.simulator.printErrors('Wrong facing!');
			return false;
		} else {
			return true;
		}
	}

	renderRobot() {
		const robot = window.simulator.getCurrentRobot(),
			robotAxisX = (robot.x + 1) * 100, // the center of the destination grid horizontally
			robotAxisY = (this.maxY - robot.y) * 100; // the center of the destination grid vertically

		const path = new Path2D();
		switch (robot.f) {
			case 'north':
				path.moveTo(robotAxisX, robotAxisY - this.robotSize);
				path.lineTo(robotAxisX - this.robotSize, robotAxisY);
				path.lineTo(robotAxisX + this.robotSize, robotAxisY);
				break;
			case 'south':
				path.moveTo(robotAxisX, robotAxisY + this.robotSize);
				path.lineTo(robotAxisX - this.robotSize, robotAxisY);
				path.lineTo(robotAxisX + this.robotSize, robotAxisY);
				break;
			case 'east':
				path.moveTo(robotAxisX + this.robotSize, robotAxisY);
				path.lineTo(robotAxisX, robotAxisY - this.robotSize);
				path.lineTo(robotAxisX, robotAxisY + this.robotSize);
				break;
			case 'west':
				path.moveTo(robotAxisX - this.robotSize, robotAxisY);
				path.lineTo(robotAxisX, robotAxisY - this.robotSize);
				path.lineTo(robotAxisX, robotAxisY + this.robotSize);
				break;
			default:
				break;
		}

		path.closePath();

		this.context.fillStyle = robot.color;
		this.context.stroke(path);
		this.context.fill(path);

		window.reportView.renderReport();
	}

	renderGoal(robot) {
		const goal = window.goal;

		const centerX = (goal.x + 1) * 100;
		const centerY = (this.maxY - goal.y) * 100;
		const radius = 35;

		const context = this.context;

		const path = new Path2D();
		path.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		path.closePath();

		if (this.atGoal(robot, goal)) {
			context.fillStyle = 'blue';
		}

		context.stroke(path);
		context.fill(path);

		context.fillStyle = 'black';
	}
}
