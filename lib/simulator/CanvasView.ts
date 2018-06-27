'use strict';

import {ExtendedWindowObj} from '../types';
import {Robot, SIDES_OF_THE_WORLD} from './Robot';
import {Goal} from './Goal';
import {getRandomInt, Point, Wall} from '../utils';

declare const window: ExtendedWindowObj;
export const FIELD_ELEMENT_ID = 'c';
const NUMBER_OF_HORIZONTAL_CELLS = 4;
const NUMBER_OF_VERTICAL_CELLS = 4;
const NUMBER_OF_WALLS = NUMBER_OF_HORIZONTAL_CELLS * NUMBER_OF_VERTICAL_CELLS / 5;	// 20% of cells number
const NUMBER_OF_ATTEMPTS_FOR_WALL = 99;	// FIXME: probably non deterministic
const WALL_WIDTH = 8;	// px


export class CanvasView {

	maxX = NUMBER_OF_HORIZONTAL_CELLS; 	// x total
	maxY = NUMBER_OF_VERTICAL_CELLS; 		// y total
	squareSize = 100; // all grids are equal width and height
	xStart = 50; // axis x starts from 50px
	yStart = 50; // axis y starts from 50px
	xEnd = this.xStart + this.squareSize * this.maxX; // axis x starts from 50px
	yEnd = this.yStart + this.squareSize * this.maxY; // axis y starts from 50px
	canvasElement = document.getElementById(FIELD_ELEMENT_ID) as HTMLCanvasElement;
	context = this.canvasElement.getContext('2d');
	theWall = this.generateWalls(NUMBER_OF_WALLS);
	robotSize = 25; // is the arrow size actually

	constructor() {
		this.canvasElement.width = 51 + this.squareSize * this.maxX;
		this.canvasElement.height = 80 + this.squareSize * this.maxY;
	}

	render(robots: Robot[], goal: Goal) {
		this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
		this.renderCanvas();
		this.renderTheWall();
		this.renderGoal(robots, goal);
		this.renderAllRobots(robots);
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
				console.warn(`Invalid orientation ${robot.f}`);
				return false;
		}

	}

	renderCanvas() {
		this.context.strokeStyle = '#707070';

		for (let x = 0; x < (this.maxX + 1); x++) { 	// draw horizontal lines
			const currentAxisX = this.xStart + x * this.squareSize;
			this.context.moveTo(currentAxisX, this.yStart);
			this.context.lineTo(currentAxisX, this.yEnd);

			this.context.strokeText(`${x}`, currentAxisX + 50, this.yEnd + 20); // mark x index
		}

		for (let y = 0; y < (this.maxY + 1); y++) {		// draw vertical lines
			const currentAxisY = this.yStart + y * this.squareSize;
			this.context.moveTo(this.xStart, currentAxisY);
			this.context.lineTo(this.xEnd, currentAxisY);

			this.context.strokeText(`${this.maxY - 1 - y}`, this.xStart - 20, currentAxisY + 50); // mark y index
		}

		this.context.stroke();
	}

	isBoundValid(input: number, toCheckAxis: string): boolean {
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

	static isFacingValid(face: string): boolean {
		if (SIDES_OF_THE_WORLD.indexOf(face.toLowerCase()) < 0) {
			window.simulator.printErrors('Wrong facing!');
			return false;
		} else {
			return true;
		}
	}

	renderAllRobots(robots: Robot[]) {
		for (let robot of robots) {
			this.renderRobot(robot);
		}
	}

	renderRobot(robot: Robot) {
		const robotAxisX = (robot.x + 1) * this.squareSize; 					// the center of the destination grid horizontally
		const robotAxisY = (this.maxY - robot.y) * this.squareSize; 	// the center of the destination grid vertically

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
	}

	renderGoal(robots: Robot[], goal: Goal) {
		const centerX = (goal.x + 1) * this.squareSize;
		const centerY = (this.maxY - goal.y) * this.squareSize;
		const radius = 35;

		const path = new Path2D();
		path.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		path.closePath();

		// changing goal color when somebody reached the goal
		for (let robot of robots) {
			if (robot.atGoal() && robot.goal === goal) {
				this.context.fillStyle = 'blue';
			}
		}

		this.context.stroke(path);
		this.context.fill(path);

		this.context.fillStyle = 'black';
	}

	addOneWall(existingWalls: Wall[], givenStartPoint?: Point): Wall[] {
		let startPoint: Point;
		let stopPoint: Point;

		for (let i = 0; i < NUMBER_OF_ATTEMPTS_FOR_WALL; i++) {
			startPoint = givenStartPoint || new Point(
				getRandomInt(1, this.maxX - 1),
				getRandomInt(1, this.maxY - 1)
			);
			const directionAngle = getRandomInt(0, 3);
			switch (directionAngle) {
				case 0:
					stopPoint = new Point(startPoint.x + 1, startPoint.y);
					break;
				case 1:
					stopPoint = new Point(startPoint.x, startPoint.y + 1);
					break;
				case 2:
					stopPoint = new Point(startPoint.x - 1, startPoint.y);
					break;
				case 3:
					stopPoint = new Point(startPoint.x, startPoint.y - 1);
					break;
				default:
					throw `Error: directionAngle should be 0-3 but it is ${directionAngle}.`;
			}
			if (stopPoint.x < 0 || stopPoint.x > this.maxX || stopPoint.y < 0 || stopPoint.y > this.maxY ||
				existingWalls.some(wall => wall.identicalTo(new Wall(startPoint, stopPoint)))
			) {
				continue;
			}
			return [...existingWalls, new Wall(startPoint, stopPoint)];
		}
		throw `The wall wasn't generated after ${NUMBER_OF_ATTEMPTS_FOR_WALL} attempts.`;
	}

	generateWalls(quantity: number): Wall[] {
		let walls: Wall[] = [];
		for (let i = 0; i < quantity; i++) {
			walls = this.addOneWall(walls);
		}
		return walls;
	}

	renderTheWall() {
		this.context.fillStyle = '#000';

		for (let wall of this.theWall) {
			if (wall.start.x === wall.stop.x) {		// vertical line
				this.context.fillRect(
					this.xStart + this.squareSize * wall.start.x - WALL_WIDTH / 2,
					this.yStart + this.squareSize * (this.maxY - Math.max(wall.start.y, wall.stop.y)),
					WALL_WIDTH,
					this.squareSize,
				);
			} else {															// horizontal line
				this.context.fillRect(
					this.xStart + this.squareSize * Math.min(wall.start.x, wall.stop.x),
					this.yStart + this.squareSize * (this.maxY - wall.start.y) - WALL_WIDTH / 2,
					this.squareSize,
					WALL_WIDTH,
				);
			}
		}
	}

}
