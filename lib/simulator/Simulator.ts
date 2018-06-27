'use strict';

import * as MainLoop from 'mainloop.js';

import {Robot} from './Robot';
import {Goal} from './Goal';
import {InputView} from './InputView';
import {ReportView} from './ReportView';
import {CanvasView} from './CanvasView';
import {ExtendedWindowObj} from '../types';

declare const window: ExtendedWindowObj;
export const NUMBER_OF_ROBOTS = 5;


export class Simulator {

	canvasView: CanvasView = window.canvasView = new CanvasView();
	reportView: ReportView = new ReportView();
	inputView: InputView;
	robots: Robot[];
	goal: Goal;

	constructor() {
		this.inputView = new InputView();

		this.restart();

		MainLoop
			.setUpdate(() => {
			})
			.setDraw(() => {
				this.canvasView.render(this.robots, this.goal);
				this.reportView.renderReport(this.robots);
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
		console.error(msg);
		this.reportView.renderErrors(msg);
	}

	restart() {
		this.goal = new Goal();
		this.robots = [];
		while (this.robots.length < NUMBER_OF_ROBOTS) {
			const newRobot = Robot.assemble(this.goal);
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
