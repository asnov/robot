'use strict';

import * as MainLoop from 'mainloop.js';

import {Robot} from './Robot';
import {Goal} from './Goal';
import {InputView} from './InputView';
import {ReportView} from './ReportView';
import {CanvasView} from './CanvasView';

export const NUMBER_OF_ROBOTS = 5;


export class Simulator {

	canvasView: CanvasView = new CanvasView();
	reportView: ReportView = new ReportView();
	inputView: InputView;
	robots: Robot[];
	goal: Goal;

	constructor() {
		this.inputView = new InputView();

		this.restart();

		MainLoop
			.setUpdate(delta => {
				for (let robot of this.robots) {
					robot.update(delta);
				}
			})
			.setDraw(() => {
				this.canvasView.render(this.robots, this.goal);
				this.reportView.renderReport(this.robots);
			})
			.setEnd((fps, panic) => {
				this.reportView.showFps(fps);
				if (panic) {
					const discardedTime = Math.round(MainLoop.resetFrameDelta());
					console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
				}
			})
			.start();
	}

	getRobotById(robotId: number) {
		return this.robots[robotId];
	}

	resetContents() {
		this.reportView.clear();
	};

	/* --------------------------------------------------- */

	/*         end of command functions
	 /* --------------------------------------------------- */
	printErrors(msg) {
		console.warn(msg);
		this.reportView.renderErrors(msg);
	}

	restart() {
		this.goal = new Goal(this.canvasView);
		this.robots = [];

		const newRobotsCount = Math.min(NUMBER_OF_ROBOTS, this.canvasView.maxX * this.canvasView.maxY - 1);
		if (newRobotsCount < NUMBER_OF_ROBOTS) {
			console.warn(`The field ${this.canvasView.maxX}x${this.canvasView.maxY} can fit only ${newRobotsCount} robots.`);
		}
		while (this.robots.length < newRobotsCount) {
			const newRobot = Robot.assemble(this.goal, this.canvasView);
			// checking position is empty
			if (
				this.robots.some(robot => (
					robot.x === newRobot.x &&
					robot.y === newRobot.y)) ||
				this.goal.x === newRobot.x &&
				this.goal.y === newRobot.y
			) {
				continue;
			}
			this.robots.push(newRobot);
			console.log(`Robot "${newRobot.color}" positioned at ${newRobot.x}, ${newRobot.y}, ${newRobot.f}`);
		}
	}

}
