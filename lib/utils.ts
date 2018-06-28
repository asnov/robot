'use strict';

export function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


export class Point {
	static new = (x: number, y: number) => new Point(x, y);

	constructor(public x: number, public y: number) {
	}

	public identicalTo = (point: Point): boolean => isTheSamePoint(this, point);
	public toString = () => `[${this.x},${this.y}]`;
}


export class Wall {
	static new = (start: Point, stop: Point) => new Wall(start, stop);

	constructor(public start: Point, public stop: Point) {
	}

	public identicalTo = (wall: Wall): boolean => isTheSameWall(this, wall);
	public toString = () => `${this.start}-${this.stop}`;
}


function isTheSamePoint(point1: Point, point2: Point): boolean {
	return (
		point1.x === point2.x &&
		point1.y === point2.y
	);
}

function isTheSameWall(wall1: Wall, wall2: Wall): boolean {
	return (
		isTheSamePoint(wall1.start, wall2.start) &&
		isTheSamePoint(wall1.stop, wall2.stop) ||
		isTheSamePoint(wall1.start, wall2.stop) &&
		isTheSamePoint(wall1.stop, wall2.start)
	);
}
