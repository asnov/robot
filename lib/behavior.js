'use strict';

import Blueshell from 'blueshell';
const rc = Blueshell.resultCodes;

class AtGoal extends Blueshell.Action {
	constructor() {
		super('at-goal');
	}

	onEvent(robot, event) {
		if (event.distanceToGoal == 0) {
			robot.color = 'red';
			console.log(`Hooray, I am at the goal!`);
			return rc.SUCCESS;
		}

		return rc.FAILURE;
	}
}

class AtWall extends Blueshell.Action {
	constructor() {
		super('at-goal');
	}

	onEvent(robot, event) {
		if (event.wallInFront) {
			console.log('there is a wall in front of me');
			// do something about it
		}

		return rc.FAILURE;
	}
}

class Move extends Blueshell.Action {
	constructor() {
		super('move');
	}

	onEvent(robot, event) {
		console.log(`Distance to goal: ${event.distanceToGoal}`);
		robot.move();

		return rc.SUCCESS;
	}
}

export class Behavior extends Blueshell.LatchedSelector {
	constructor() {
		super('robot-ai', [
			new AtGoal(),
			new AtWall(),
			new Move()
		]);
	}
};
