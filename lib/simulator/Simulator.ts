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

	constructor() {
		window.inputView = new InputView();
		window.canvasView = new CanvasView();
		window.reportView = new ReportView();

		this.restart();

		MainLoop
			.setUpdate(() => {
			})
			.setDraw(() => {
				window.canvasView.render(window.robots, window.goal);
			})
			.start();
	}

	getRobotById(robotId: number) {
		return window.robots[robotId];
	}

	resetContents() {
		window.reportView.clear();
	};

	/* --------------------------------------------------- */

	/*         end of command functions
	 /* --------------------------------------------------- */
	printErrors(msg) {
		console.error(msg);
		window.reportView.renderErrors(msg);
	}

	restart() {
		window.goal = new Goal();
		window.robots = [];
		while (window.robots.length < NUMBER_OF_ROBOTS) {
			const newRobot = Robot.assemble(window.goal);
			// checking position is empty
			if (
				window.robots.some(robot => (
					robot.x === newRobot.x &&
					robot.y === newRobot.y)) ||
				window.goal.x === newRobot.x &&
				window.goal.y === newRobot.y
			) {
				continue;
			}
			window.robots.push(newRobot);
			console.log(`Robot "${newRobot.color}" positioned at ${newRobot.x}, ${newRobot.y}, ${newRobot.f}`);
		}
	}

}
